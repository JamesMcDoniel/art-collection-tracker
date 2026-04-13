using System.Net;
using System.Security.Cryptography;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly string _clientURL;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;

    public AuthService(AppDbContext context, ITokenService tokenService, IEmailService emailService, IConfiguration config)
    {
        _context = context;
        _clientURL = config["AppSettings:ClientURL"]!;
        _tokenService = tokenService;
        _emailService = emailService;
    }

    public async Task<AuthDto> Login(LoginDto dto)
    {
        // Find first User whose Username matches the submitted one
        var user = await _context.User
            .Include(user => user.Role)
            .Include(user => user.RefreshTokens)
            .FirstOrDefaultAsync(user => user.Email == dto.Email);

        // User doesn't exist or provided password didn't match stored password hash
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new Exception("Invalid email or password");
        }

        // Login was successful, but account is disabled
        if (user.Disabled)
        {
            throw new Exception("Account disabled - Contact IT");
        }

        // Use TokenService to generate a JWT and RefreshToken
        var token = _tokenService.CreateJwt(user);
        var refreshToken = _tokenService.CreateRefreshToken();

        // Store the RefreshToken in Database
        user.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        // Return the new Tokens and User information
        return new AuthDto
        {
            Token = token,
            RefreshToken = refreshToken.Token,
            Email = user.Email,
            Role = user.Role!.Title
        };
    }

    public async Task<AuthDto> RefreshToken(string token)
    {
        // Search the database for the given token
        var refreshToken = await _context.RefreshToken
            .Include(refreshToken => refreshToken.User)
            .ThenInclude(user => user!.Role)
            .FirstOrDefaultAsync(refreshToken => refreshToken.Token == token);

        // If token is not found, or if it's expired / revoked, throw error
        if (refreshToken == null || !refreshToken.IsActive)
        {
            throw new Exception("Invalid RefreshToken");
        }

        // Revoke the found token, we're going to rotate tokens now
        refreshToken.RevokedAt = DateTime.UtcNow;

        // Create a new pair of JWT and RefreshToken
        var newRefreshToken = _tokenService.CreateRefreshToken();
        var jwt = _tokenService.CreateJwt(refreshToken.User!);

        // Store the new RefreshToken
        refreshToken.User!.RefreshTokens.Add(newRefreshToken);
        await _context.SaveChangesAsync();

        // Return the new token pair and User information
        return new AuthDto
        {
            Token = jwt,
            RefreshToken = newRefreshToken.Token,
            Email = refreshToken.User.Email,
            Role = refreshToken.User.Role!.Title
        };
    }

    public async Task RevokeRefreshToken(string token)
    {
        // Find the matching stored token
        var refreshToken = await _context.RefreshToken
            .FirstOrDefaultAsync(refreshToken => refreshToken.Token == token);

        if (refreshToken != null)
        {
            // Edit the token's revoked date, revoking it
            refreshToken.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RequestPasswordReset(string email)
    {
        if (email == "default_admin") return;

        var user = await _context.User.FirstOrDefaultAsync(user => user.Email == email);

        if (user == null)
        {
            throw new Exception("Error requesting reset");
        }

        // Invalidate any existing active tokens
        var existingTokens = await _context.PasswordReset
            .Where(passwordReset => passwordReset.UserId == user.Id &&
                !passwordReset.isUsed &&
                passwordReset.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();

        foreach (var token in existingTokens)
        {
            token.isUsed = true;
        }

        // Generate a random string to use as token
        var newToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

        // Save token to database
        var passwordReset = new PasswordReset
        {
            Token = newToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            isUsed = false
        };

        _context.PasswordReset.Add(passwordReset);
        await _context.SaveChangesAsync();

        // Send email to User
        var resetLink = $"{_clientURL}/reset-password?token={WebUtility.UrlEncode(newToken)}&email={user.Email}";
        await _emailService.SendEmail(user.Email, "Artwork Tracker - Reset Password",
            $"<p>Click <a href='{resetLink}'>here</a> to reset your password.</p><p>or, Copy and Paste:</p><p>{resetLink}</p>");
    }

    public async Task ResetPassword(string email, string token, string newPassword)
    {
        // Get User and their Reset Tokens
        var user = await _context.User
            .Include(user => user.PasswordResets)
            .FirstOrDefaultAsync(user => user.Email == email);

        if (user == null)
        {
            throw new Exception("Unable to find user");
        }

        // Find the current token
        var previousToken = user.PasswordResets.FirstOrDefault(passwordReset =>
            passwordReset.Token == token &&
            !passwordReset.isUsed &&
            passwordReset.ExpiresAt > DateTime.UtcNow);

        if (previousToken == null)
        {
            throw new Exception("No tokens found");
        }

        // Update Password & void the Reset token
        var salt = BCrypt.Net.BCrypt.GenerateSalt();
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, salt);
        previousToken.isUsed = true;

        await _context.SaveChangesAsync();
    }

    public async Task Register(RegisterDto dto)
    {
        // Check to see if provided Email already exists in database
        bool isTaken = await _context.User.AnyAsync(user => user.Email == dto.Email);

        if (isTaken)
        {
            throw new Exception("Email already in use");
        }

        // Create new User object to store in Database
        var user = new User
        {
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            CreatedAt = DateTime.UtcNow,
            Disabled = false,
            Role = dto.Role
        };

        // Store User in database
        _context.User.Add(user);
        await _context.SaveChangesAsync();

        await _emailService.SendEmail(dto.Email, "Artwork Tracker - Account Created",
            $"<h2>Account Created</h2><p>Login: {dto.Email}</p><p>Click <a href='{_clientURL}/forgot-password'>here</a> to set your password.</p><p>or, copy and paste the link directly:</p><p>{_clientURL}/forgot-password</p>");
    }

    public async Task<List<UserDto>> GetAllUsers()
    {
        var users = await _context.User
            .Select(user => new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role!.Title,
                Notes = user.Notes != null ? user.Notes : null,
                CreatedAt = user.CreatedAt,
                Disabled = user.Disabled
            })
            .ToListAsync();

        return users;
    }

    public async Task UpdateUser(int id, UpdateUserDto dto)
    {
        var user = await _context.User
            .FirstOrDefaultAsync(user => user.Id == id);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        var role = await _context.Role
            .FirstOrDefaultAsync(role => role.Title == dto.Role);

        if (role == null)
        {
            throw new Exception("Role not found");
        }

        user.Email = dto.Email;
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Role = role;
        user.Notes = dto.Notes;

        await _context.SaveChangesAsync();
    }

    public async Task UpdateDisabled(int id, bool isDisabled)
    {
        var user = await _context.User
            .FirstOrDefaultAsync(user => user.Id == id);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        user.Disabled = isDisabled;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteUser(int id)
    {
        var user = await _context.User
            .FirstOrDefaultAsync(user => user.Id == id);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        _context.User.Remove(user);
        await _context.SaveChangesAsync();
    }
}
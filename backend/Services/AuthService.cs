using backend.Data;
using backend.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthService(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<AuthDto> Login(LoginDto dto)
    {
        // Find first User whose Username matches the submitted one
        var user = await _context.User
            .Include(user => user.Role)
            .Include(user => user.RefreshTokens)
            .FirstOrDefaultAsync(user => user.Username == dto.Username);

        // If no user is found, or if provided password doesn't match stored password,
        // throw exception
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new Exception("Invalid credentials");
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
            Username = user.Username,
            Role = user.Role!.Title
        };
    }

    public async Task Register(RegisterDto dto)
    {
        // Check to see if provided Username already exists in database
        bool isTaken = await _context.User.AnyAsync(user => user.Username == dto.Username);

        if (isTaken)
        {
            throw new Exception("Username already exists");
        }

        // Salt and Hash password before adding to database
        string salt = BCrypt.Net.BCrypt.GenerateSalt();
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password, salt);

        // Create new User object to store in Database
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = hashedPassword,
            RoleId = dto.Role
        };

        // Store User in database
        _context.User.Add(user);
        await _context.SaveChangesAsync();
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
            Username = refreshToken.User.Username,
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
}
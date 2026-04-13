public interface IAuthService
{
    Task<AuthDto> Login(LoginDto dto);
    Task Register(RegisterDto dto);
    Task<List<UserDto>> GetAllUsers();
    Task UpdateUser(int id, UpdateUserDto dto);
    Task UpdateDisabled(int id, bool isDisabled);
    Task DeleteUser(int id);
    Task<AuthDto> RefreshToken(string token);
    Task RevokeRefreshToken(string token);
    Task RequestPasswordReset(string email);
    Task ResetPassword(string email, string token, string newPassword);
}
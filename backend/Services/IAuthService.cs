public interface IAuthService
{
    Task<AuthDto> Login(LoginDto dto);
    Task Register(RegisterDto dto);
    Task<AuthDto> RefreshToken(string token);
    Task RevokeRefreshToken(string token);
}
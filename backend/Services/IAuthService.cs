public interface IAuthService
{
    Task<TokenDto> Login(LoginDto dto);
    Task Register(RegisterDto dto);
    Task<TokenDto> RefreshToken(string token);
    Task RevokeRefreshToken(string token);
}
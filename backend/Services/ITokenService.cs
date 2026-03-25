using backend.Models;

public interface ITokenService
{
    string CreateJwt(User user);
    RefreshToken CreateRefreshToken();
}
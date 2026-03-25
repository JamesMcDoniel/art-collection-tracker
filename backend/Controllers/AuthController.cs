using backend.Filters;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAntiforgery _antiforgery;
        private readonly IAuthService _authService;

        public AuthController(IAntiforgery antiforgery, IAuthService authService)
        {
            _antiforgery = antiforgery;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            try
            {
                // Get Auth and CSRF Tokens
                var result = await _authService.Login(dto);
                var tokens = _antiforgery.GetAndStoreTokens(HttpContext);

                // Attached the Tokens to Cookies
                Response.Cookies.Append("accessToken", result.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(15)
                });

                Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, new CookieOptions
                {
                    HttpOnly = false, // We want frontend to read this one
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(8)
                });

                return Ok(new SessionDto
                {
                    Username = result.Username,
                    Role = result.Role
                });
            }
            catch (Exception exception)
            {
                return Unauthorized(exception.Message);
            }
        }

        [ValidateCSRFToken]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Pull the token from Cookie
            var refreshToken = Request.Cookies["refreshToken"];

            // Revoke the token, if one exists
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _authService.RevokeRefreshToken(refreshToken);
            }

            // Delete the Cookies
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
            Response.Cookies.Delete("XSRF-TOKEN");

            return Ok();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            try
            {
                await _authService.Register(dto);
                return Ok();
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [ValidateCSRFToken]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(string refreshToken)
        {
            try
            {
                // Get Auth and CSRF Tokens
                var result = await _authService.RefreshToken(refreshToken);
                var tokens = _antiforgery.GetAndStoreTokens(HttpContext);

                // Attached the Tokens to Cookies
                Response.Cookies.Append("accessToken", result.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(15)
                });

                Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, new CookieOptions
                {
                    HttpOnly = false, // We want frontend to read this one
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(8)
                });

                return Ok(new SessionDto
                {
                    Username = result.Username,
                    Role = result.Role
                });
            }
            catch (Exception exception)
            {
                return Unauthorized(exception.Message);
            }
        }
    }
}
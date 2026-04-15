using backend.Filters;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
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
                    Email = result.Email,
                    Role = result.Role
                });
            }
            catch (Exception exception)
            {
                return Unauthorized(exception.Message);
            }
        }

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

        [Authorize(Roles = "IT")]
        [ValidateCSRFToken]
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

        [Authorize(Roles = "IT")]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _authService.GetAllUsers();
                return Ok(users);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [Authorize(Roles = "IT")]
        [ValidateCSRFToken]
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                await _authService.UpdateUser(id, dto);
                return Ok();
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }

        [Authorize(Roles = "IT")]
        [ValidateCSRFToken]
        [HttpPatch("users/{id}/disabled")]
        public async Task<IActionResult> UpdateDisabled(int id, UpdateDisabledDto dto)
        {
            try
            {
                await _authService.UpdateDisabled(id, dto.Disabled);
                return NoContent();
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }

        [Authorize(Roles = "IT")]
        [ValidateCSRFToken]
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _authService.DeleteUser(id);
                return NoContent();
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(refreshToken))
                {
                    return Unauthorized();
                }

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
                    Email = result.Email,
                    Role = result.Role
                });
            }
            catch (Exception exception)
            {
                return Unauthorized(exception.Message);
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            try
            {
                await _authService.RequestPasswordReset(dto.Email);
                return Ok();
            }
            catch
            {
                return Ok();
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            try
            {
                await _authService.ResetPassword(dto.Email, dto.Token, dto.NewPassword);
                return Ok();
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}
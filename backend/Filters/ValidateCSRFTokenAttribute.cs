using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend.Filters
{
    public class ValidateCSRFTokenAttribute : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next
        )
        {
            var antiforgery = context.HttpContext.RequestServices
                .GetRequiredService<IAntiforgery>();

            try
            {
                await antiforgery.ValidateRequestAsync(context.HttpContext);
                await next();
            }
            catch (AntiforgeryValidationException)
            {
                context.Result = new ObjectResult(new
                {
                    error = "Invalid CSRF token"
                })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }
        }
    }
}
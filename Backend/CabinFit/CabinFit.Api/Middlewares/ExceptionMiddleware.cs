using CabinFit.Api.Exceptions;
using System.Text.Json;

namespace CabinFit.Api.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Resource not found");
                await HandleExceptionAsync(httpContext, StatusCodes.Status404NotFound, ex.Message);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation/argument error");
                await HandleExceptionAsync(httpContext, StatusCodes.Status400BadRequest, ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access");
                await HandleExceptionAsync(httpContext, StatusCodes.Status401Unauthorized, ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation");
                await HandleExceptionAsync(httpContext, StatusCodes.Status400BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                await HandleExceptionAsync(httpContext, StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, int statusCode, string message)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var problemDetails = new
            {
                type = GetErrorType(statusCode),
                title = GetErrorTitle(statusCode),
                status = statusCode,
                error = message,
                instance = context.Request.Path,
                traceId = context.TraceIdentifier
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
        }

        private static string GetErrorType(int statusCode) 
        {
            return statusCode switch
            {
                404 => "https://tools.ietf.org/html/rfc9110#section-15.5.5",
                400 => "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                401 => "https://tools.ietf.org/html/rfc9110#section-15.5.2",
                500 => "https://tools.ietf.org/html/rfc9110#section-15.6.1",
                _ => "about:blank"
            };
        }

        private static string GetErrorTitle(int statusCode)
        {
            return statusCode switch
            {
                404 => "Not Found",
                400 => "Bad Request",
                401 => "Unauthorized",
                500 => "Internal Server Error",
                _ => "An error occurred"
            };
        }
    }

}

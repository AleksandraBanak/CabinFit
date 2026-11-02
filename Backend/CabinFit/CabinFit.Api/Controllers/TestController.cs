using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CabinFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : Controller
    {
        [HttpGet("verify")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public IActionResult VerifyToken()
        {
            // If execution reaches here, the token is valid
            return Ok(new { isValid = true });
        }
    }
}

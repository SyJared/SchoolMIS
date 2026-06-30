using backend.Data;
using Dtos;
using Microsoft.AspNetCore.Mvc;
using model;
using Microsoft.EntityFrameworkCore;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoginController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
            {
                return NotFound(new {message="Incorrect Email"});
            }

            if (user.Password != dto.Password)
            {
                return Unauthorized(new {Message= "Incorrect password." });
            }

            return Ok(new
            {
                Message = "Login successful",
                user.Id,
                user.Email
            });
        }
    }
}
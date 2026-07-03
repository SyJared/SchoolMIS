using backend.Data;
using Dtos;
using Microsoft.AspNetCore.Mvc;
using model;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<Users> _passwordHasher = new();
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

            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);
            if(result == PasswordVerificationResult.Failed)
            {
                return BadRequest(new { message = "Incorrect Password" });
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
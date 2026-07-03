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
        private readonly JwtService _jwtService;
        public LoginController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
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
            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                Message = "Login successful",
                token
            });
        }
    }
}
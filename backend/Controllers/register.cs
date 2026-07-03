using backend.Data;
using Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using model;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<Users> _passwordHasher = new();
        public RegisterController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]

        public async Task<IActionResult> CreateRegister(RegisterDto dto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if(existingUser != null)
            {
                return BadRequest("User with this email already exists.");
            }
            var user = new Users { Email = dto.Email, Name =dto.Name};
            user.Password = _passwordHasher.HashPassword(user, dto.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
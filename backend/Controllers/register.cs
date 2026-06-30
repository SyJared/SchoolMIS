using backend.Data;
using Dtos;
using Microsoft.AspNetCore.Mvc;
using model;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RegisterController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]

        public async Task<IActionResult> CreateRegister(RegisterDto dto)
        {
            var user = new Users { Email = dto.Email , Password = dto.Password, Name =dto.Name};
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
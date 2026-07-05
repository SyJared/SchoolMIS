using Dtos;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class  ClassesController : ControllerBase
    {
        private readonly ClassService _classService;
        public ClassesController(ClassService classService)
        {
            _classService = classService;
        }

        [HttpPost]
        public async Task<IActionResult>CreateClass(ClassesDto dto)
        {
            var createdClass = await _classService.CreateClass(dto);
            return Ok(new { message = "Class created successfully", data = createdClass });
        }
    }
}
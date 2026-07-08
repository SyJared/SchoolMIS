using Dtos;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(Roles = "Admin,Teacher")]
        [HttpPost]
        public async Task<IActionResult>CreateClass(ClassesDto dto)
        {
            var createdClass = await _classService.CreateClass(dto);
            return Ok(new { message = "Class created successfully", data = createdClass });
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllClass()
        {
            var classes = await _classService.GetAllClass();
            return Ok(classes);
        }
        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost("{classId}")]
        public async Task<IActionResult>MarkAsDone(int classId)
        {
            await _classService.MarkClassAsDone(classId);
            return Ok();
        }
    }
}
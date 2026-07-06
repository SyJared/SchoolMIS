using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : Controller
    {
        private readonly TeacherService _teacherService;

        public TeacherController(TeacherService teacherService)
        {
            _teacherService = teacherService;
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult>SearchTeacher(string? search) {
            var teachers = await _teacherService.SearchAdvisor(search);
            return Ok(teachers);
		}
	}
}
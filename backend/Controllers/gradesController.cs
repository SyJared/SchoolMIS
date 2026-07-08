using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradesController : ControllerBase
    {
        private readonly IGradeService _gradeService;

        public GradesController(IGradeService gradeService)
        {
            _gradeService = gradeService;
        }

        [HttpGet("classroom/{classroomId}")]
        public async Task<IActionResult> GetByClassroom(int classroomId)
        {
            var result = await _gradeService.GetGradesByClassroomAsync(classroomId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> SaveGrades([FromBody] SaveGradesRequest request)
        {
            if (request?.Grades == null || !request.Grades.Any())
                return BadRequest("No grades provided.");

            await _gradeService.SaveGradesAsync(request);
            return Ok(new { message = "Grades saved successfully." });
        }
    }
}
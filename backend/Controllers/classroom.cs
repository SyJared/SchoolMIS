using Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;



namespace backend.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ClassroomController : ControllerBase
    {
        private readonly ClassroomService _classroomService;
        public ClassroomController(ClassroomService classroomService)
        {
            _classroomService = classroomService;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]  

        public async Task<IActionResult> CreateClassroom(CreateClassroomDto dto)
        {
           var user = await _classroomService.CreateClassroom(dto);

            return Ok(new
            {
                user,
                Message = "Classroom created"
            });
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetClassroom()
        {
            var classrooms = await _classroomService.GetClassrooms();

            return Ok(new
            {
                classrooms,
                message = "classroom retrieved"
            });
        }
        [Authorize]
        [HttpGet("{ClassroomId}")]
        public async Task<IActionResult> GetClassroomById(int ClassroomId)
        {
            var classroom = await _classroomService.GetClassroomById(ClassroomId);
            return Ok(classroom);
        }
        [Authorize(Roles ="Admin")]
        [HttpDelete("{ClassroomId}")]
        public async Task<IActionResult>DeleteClassroom(int ClassroomId)
        {
            var classroom = await _classroomService.DeleteClassroomById(ClassroomId);
            return Ok();
        }

        [Authorize(Roles = "Student")]
        [HttpGet("student/{classroomId}")]
        public async Task<IActionResult> GetStudentClassroom(int classroomId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _classroomService.GetStudentClassroomDetails(userId, classroomId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

    }
}
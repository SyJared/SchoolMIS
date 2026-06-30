using Microsoft.AspNetCore.Mvc;
using Dtos;
using model;
using backend.Data;
using Microsoft.EntityFrameworkCore;


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

        [HttpPost]

        public async Task<IActionResult> CreateClassroom(CreateClassroomDto dto)
        {
           var user = _classroomService.CreateClassroom(dto);

            return Ok(new
            {
                user,
                Message = "Classroom created"
            });
        }

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

        [HttpGet("{ClassroomId}")]
        public async Task<IActionResult> GetClassroomById(int ClassroomId)
        {
            var classroom = await _classroomService.GetClassroomById(ClassroomId);
            return Ok(classroom);
        }
    }
}
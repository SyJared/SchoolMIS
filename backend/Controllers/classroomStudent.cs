using Dtos;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]

    public class ClassroomStudentController : ControllerBase
    {
        private readonly ClassroomStudentService _classroomStudentService;

        public ClassroomStudentController(ClassroomStudentService classroomStudentService)
        {
            _classroomStudentService = classroomStudentService;
        }

        [HttpPost]

        public async Task<IActionResult>InsertIntoClassroomStudent(ClassroomStudentsDto dto)
        {
            var student = await _classroomStudentService.InsertStudent(dto);
            return Ok(new
            {
                student,
                message = "Insert Successful"
            });
        }

        [HttpGet("{classroomId}")]

        public async Task<IActionResult>GetStudentOfClassroom(int classroomId)
        {
            var students = await _classroomStudentService.GetStudentOfClassroom(classroomId);
            return Ok(students);
        }
    }
}

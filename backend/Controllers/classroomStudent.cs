using Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using System.Security.Claims;

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
        [Authorize(Roles = "Admin,Teacher")]
        [HttpPost]

        public async Task<IActionResult>InsertIntoClassroomStudent(ClassroomStudentsDto dto)
        {
            var student = await _classroomStudentService.InsertStudent(dto);
            if(student == null)
            {
                return Conflict(new
                {
                    message = "Student already in the classroom"
                });
            }
            return Ok(new
            {
                student,
                message = "Insert Successful"
            });
        }
        [AllowAnonymous]
        [HttpGet("{classroomId}")]

        public async Task<IActionResult>GetStudentOfClassroom(int classroomId)
        {
            var students = await _classroomStudentService.GetStudentOfClassroom(classroomId);
            return Ok(students);
        }
        [Authorize(Roles ="Student")]
        [HttpGet("my")]
        public async Task<IActionResult>getClassrooms()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var classrooms = await _classroomStudentService.GetMyClassroom(userId);

            return Ok(classrooms);
        }
    }
}

using Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using model;
using System.Security.Claims;

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
        [Authorize(Roles = "Teacher")]
        [HttpGet("teacher")]
        public async Task<IActionResult> GetTeacherClassrooms()
        {
            var AdvisorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var classrooms = await _classService.GetAllInfoForDashboard(AdvisorId);
            if (classrooms == null)
            {
                return Ok(new
                {
                    mewssage = "no classrooms yet"
                });
            }
            return Ok(classrooms);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("student")]
        public async Task<IActionResult> ClassesByStudentId()
        {
            var StudentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            
            var classes = await _classService.GetClassByStudentId(StudentId);

            if(classes == null && classes.Count== 0)
            {
                return NotFound();
            }
            return Ok(classes);
        }
    }
}
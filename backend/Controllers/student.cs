using backend.Data;
using Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using model;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly StudentService _studentService;

        public StudentsController(StudentService studentService)
        {
            _studentService = studentService;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetStudents(string? search)
        {
            var students = await _studentService.GetStudents(search);
            return Ok(students);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateStudent(CreateStudentDto dto)
        {
            var newStudent = await _studentService.CreateStudent(dto);
            return Ok(newStudent);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteStudent(int Id)
        {
            var deleteStud = await _studentService.DeleteStudent(Id);
            return Ok(deleteStud);
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("{Id}")]
        public async Task<IActionResult> EditStudent(int Id, EditStudentDto dto)
        {
            var editStud = await _studentService.EditStudent(Id, dto);
            return Ok(editStud);
        }

        [Authorize(Roles ="Student,Admin")]
        [HttpPut]
        public async Task<IActionResult> InsertStudentInfo([FromForm] StudentProfileDto dto)
        {
            var student = await _studentService.InsertStudentInfo(dto);
            return Ok(student);
        }

        [Authorize(Roles ="Student,Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentInfoById(int id)
        {
            var student = await _studentService.getStudentById(id);
            return Ok(student);
        }
        [Authorize(Roles = "Student")]
        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var dashboard = await _studentService.GetStudentDashboard(userId);

            if (dashboard == null)
                return NotFound();

            return Ok(dashboard);
        }
    }
}
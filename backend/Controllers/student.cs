using Microsoft.AspNetCore.Mvc;
using Dtos;
using model;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

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
    }
}
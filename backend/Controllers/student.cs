using Microsoft.AspNetCore.Mvc;
using Dtos;
using model;
using backend.Data;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet]
        public async Task<IActionResult> GetStudents(string? search)
        {
            var students = await _studentService.GetStudents(search);
            return Ok(students);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStudent(CreateStudentDto dto)
        {
            var newStudent = await _studentService.CreateStudent(dto);
            return Ok(newStudent);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteStudent(int Id)
        {
            var deleteStud = await _studentService.DeleteStudent(Id);
            return Ok(deleteStud);
        }

        [HttpPatch("{Id}")]
        public async Task<IActionResult> EditStudent(int Id, EditStudentDto dto)
        {
            var editStud = await _studentService.EditStudent(Id, dto);
            return Ok(editStud);
        }
    }
}
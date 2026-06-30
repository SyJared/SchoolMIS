using backend.Data;
using Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using model;

public class StudentService
{
    private readonly AppDbContext _context;

    public StudentService (AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Student>> GetStudents(string? search)
    {
        var query = _context.Students.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(s => s.Name.Contains(search));
        }
        return await query.ToListAsync();
    }

    public async Task<Student>CreateStudent (CreateStudentDto dto)
    {
        var newStudent = new Student
        {
            Name = dto.Name,
        };
        _context.Students.Add(newStudent);
        await _context.SaveChangesAsync();

        return newStudent;
    }
    public async Task<Student?>EditStudent(int Id, EditStudentDto dto)
    {
        var existing = await _context.Students.FindAsync(Id);
        if (existing == null)
        {
            return null;
        };
        existing.Name = dto.Name;
        await _context.SaveChangesAsync();
        return existing;
    }
    public async Task<Student?>DeleteStudent(int Id)
    {
        var studentr = await _context.Students.FindAsync(Id);
        if (studentr == null)
        {
            return null;
        }
        _context.Students.Remove(studentr);
        await _context.SaveChangesAsync();
        return studentr;
    }
    
}
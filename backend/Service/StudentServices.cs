using backend.Data;
using Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using model;

public class StudentService
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<Users> _passwordHasher = new();

    public StudentService(AppDbContext context)
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

    private Users CreateUser(CreateStudentDto dto)
    {
        return new Users
        {
            Name = dto.Name,
            Email = dto.Email,
            Password = _passwordHasher.HashPassword(null, dto.Password),
            Role = Role.Student
        };
    }

    public async Task<Student> CreateStudent(CreateStudentDto dto)
    {
        var user = CreateUser(dto);

        var student = new Student
        {
            Name = dto.Name,
            User = user
        };

        _context.Students.Add(student);

        await _context.SaveChangesAsync();

        return student;
    }

    public async Task<Student?> EditStudent(int id, EditStudentDto dto)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
            return null;

        student.Name = dto.Name;

        if (student.User != null)
        {
            student.User.Name = dto.Name;
        }

        await _context.SaveChangesAsync();

        return student;
    }

    public async Task<Student?> DeleteStudent(int id)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
            return null;

        if (student.User != null)
        {
            _context.Users.Remove(student.User);
        }

        _context.Students.Remove(student);

        await _context.SaveChangesAsync();

        return student;
    }
}
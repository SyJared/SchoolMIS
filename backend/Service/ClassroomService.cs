using backend.Data;
using Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using model;

public class ClassroomService
{
    private readonly AppDbContext _context;
    public ClassroomService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Classroom> CreateClassroom(CreateClassroomDto dto)
    {
        var classroom = new Classroom
        {
            Advisor = dto.Advisor,
            Subject = dto.Subject,
            GradeLevel = dto.GradeLevel,
            Section = dto.Section,
        };
        _context.Classrooms.Add(classroom);
        await _context.SaveChangesAsync();
        return classroom;
    }
    public async Task<List<Classroom>> GetClassrooms()
    {
        var classrooms = await _context.Classrooms.ToListAsync();
        return classrooms;
    }
    public async Task<Classroom?> GetClassroomById(int ClassroomId)
    {
        return await _context.Classrooms.FindAsync(ClassroomId);
    }
}
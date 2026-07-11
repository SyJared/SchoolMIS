using backend.Data;
using Dtos;
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
        var teacher = await _context.Users.FindAsync(dto.AdvisorId);

        if (teacher == null)
        {
            throw new Exception("Teacher not found.");
        }

        var classroom = new Classroom
        {
            AdvisorId = dto.AdvisorId,
            Subject = dto.Subject,
            GradeLevel = dto.GradeLevel,
            Section = dto.Section
        };

        _context.Classrooms.Add(classroom);
        await _context.SaveChangesAsync();

        return classroom;
    }

    public async Task<List<Classroom>> GetClassrooms()
    {
        return await _context.Classrooms
            .Include(c => c.Advisor)
            .ToListAsync();
    }

    public async Task<Classroom?> GetClassroomById(int classroomId)
    {
        return await _context.Classrooms
            .Include(c => c.Advisor)
            .FirstOrDefaultAsync(c => c.Id == classroomId);
    }

    public async Task<Classroom?> DeleteClassroomById(int classroomId)
    {
        var classroom = await _context.Classrooms.FindAsync(classroomId);

        if (classroom == null)
        {
            return null;
        }

        _context.Classrooms.Remove(classroom);
        await _context.SaveChangesAsync();

        return classroom;
    }
    
}
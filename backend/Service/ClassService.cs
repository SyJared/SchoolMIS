using backend.Data;
using Dtos;
using Microsoft.EntityFrameworkCore;
using Model;

public class ClassService
{
    private readonly AppDbContext _context;

    public ClassService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Classes> CreateClass(ClassesDto dto)
    {
        var newClass = new Classes
        {
            ClassroomId = dto.ClassroomId,
            Start = dto.Start,
            End = dto.End
        };
        _context.Classes.Add(newClass);
        await _context.SaveChangesAsync();
        return newClass;
    }
    public async Task<List<Classes>> GetAllClass()
    {
        var classes = await _context.Classes.ToListAsync();
        return classes;
    }
    public async Task MarkClassAsDone(int classId)
    {
        var classes = await _context.Classes.FindAsync(classId);

        classes.IsDone = true;
        await _context.SaveChangesAsync();
    }
}
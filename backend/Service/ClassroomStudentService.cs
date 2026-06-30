using backend.Data;
using backend.Model;
using Dtos;
using Microsoft.EntityFrameworkCore;

public class ClassroomStudentService
{
    private readonly AppDbContext _context;

    public ClassroomStudentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ClassroomStudents?>InsertStudent(ClassroomStudentsDto dto)
    {
        var existing = await _context.ClassroomsStudents
            .FirstOrDefaultAsync(cs =>
            cs.StudentId == dto.StudentId &&
            cs.ClassroomId == dto.ClassroomId);

        if (existing != null)
        {
            return null;
        }
        var newstud = new ClassroomStudents
        {
            StudentId = dto.StudentId,
            ClassroomId = dto.ClassroomId,
        };
        _context.ClassroomsStudents.Add(newstud);
        await _context.SaveChangesAsync();
        return newstud;
    }
    public async Task<List<ClassroomStudents>> GetStudentOfClassroom(int classroomId)
    {
        var students = await _context.ClassroomsStudents
            .Where(cs => cs.ClassroomId == classroomId)
            .Include(cs => cs.Student)
            .ToListAsync();
        return students;
    }
}
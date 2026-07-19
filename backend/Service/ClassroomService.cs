using backend.Data;
using backend.Model;
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

    public async Task<StudentClassroomDetailsDto?> GetStudentClassroomDetails(
    int userId,
    int classroomId)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            return null;

        return await _context.Classrooms
            .Where(c => c.Id == classroomId)
            .Where(c => c.ClassroomStudents.Any(cs => cs.StudentId == student.Id))
            .Select(c => new StudentClassroomDetailsDto(
                c.Id,
                c.Subject,
                c.GradeLevel,
                c.Section,
                c.Advisor.Name,

                c.Classes
                    .OrderBy(x => x.Start)
                    .Select(x => new StudentClassDto(
                        x.Id,
                        x.Start,
                        x.End,
                        x.IsDone
                    ))
                    .ToList(),

                c.Classes
                    .SelectMany(x => x.Attendances)
                    .Where(a => a.StudentId == student.Id)
                    .Select(a => new ForStudentAttendanceDto(
                        a.StudentId,
                        a.Student.Name,
                        a.Status,
                        a.ClassId
                    ))
                    .ToList()
            ))
            .FirstOrDefaultAsync();
    }

}
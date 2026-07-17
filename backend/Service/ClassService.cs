using backend.Data;
using Dtos;
using Microsoft.EntityFrameworkCore;
using model;
using Model;

public class ClassService
{
    private readonly AppDbContext _context;
    private readonly NotificationService _notifcationService;
    public ClassService(AppDbContext context, NotificationService notificationService)
    {
        _context = context;
        _notifcationService = notificationService;
    }

    public async Task<Classes> CreateClass(ClassesDto dto)
    {
        var students = await _context.ClassroomsStudents.Where(cs => cs.ClassroomId == dto.ClassroomId)
            .Include(cs => cs.Student).ToListAsync();
        var newClass = new Classes
        {
            ClassroomId = dto.ClassroomId,
            Start = dto.Start,
            End = dto.End
        };
        _context.Classes.Add(newClass);
        await _context.SaveChangesAsync();
        
        foreach (var student in students)
        {
            await _notifcationService.CreateNotification(
                student.Student.UserId,
                $"A new class has been scheduled for {newClass.Start:f}"
                );
        }
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
    public async Task<List<TeacherDashboardDto>> GetAllInfoForDashboard(int advisorId)
    {
        var classes = await _context.Classes
            .Where(c => c.Classroom.AdvisorId == advisorId)
            .Select(c => new TeacherDashboardDto(
                c.Id,
                c.Classroom.Subject,
                c.Classroom.GradeLevel,
                c.Classroom.Section,
                c.Start,
                c.End,
                c.IsDone,
                c.Attendances.Select(a => new StudentAttendanceDto(
                    a.StudentId,
                    a.Student.Name,
                    a.Status
                )).ToList()
            ))
            .ToListAsync();

        return classes;
    }
    public async Task<List<ClassesByStudentIdDto>> GetClassByStudentId(int StudentId)
    {
        var student = await _context.Students
    .FirstOrDefaultAsync(s => s.UserId == StudentId);

        if (student == null)
        {
            return null;
        }
        var classes = await _context.Classes
            .Where(c => _context.ClassroomsStudents.Any(cs =>
                cs.StudentId == student.Id &&
                cs.ClassroomId == c.ClassroomId))
            .Select(c => new ClassesByStudentIdDto(
                c.Id,
                c.Classroom.Subject,
                c.Classroom.Advisor.Name,
                c.Start,
                c.End
            ))
            .ToListAsync();


        return classes;
    }
}
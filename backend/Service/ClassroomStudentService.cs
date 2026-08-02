using backend.Data;
using backend.Model;
using Dtos;
using Microsoft.EntityFrameworkCore;
using model;

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
    public async Task<List<StudentClassroomDto>> GetMyClassroom(int userId)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            return new List<StudentClassroomDto>();

        return await _context.ClassroomsStudents
            .Where(cs => cs.StudentId == student.Id)
            .Select(cs => new StudentClassroomDto(
                cs.Classroom.Id,
                cs.Classroom.Subject,
                cs.Classroom.GradeLevel,
                cs.Classroom.Section,
                cs.Classroom.Advisor.Name
            ))
            .ToListAsync();
    }
    public async Task<List<TeacherStudentDto>> GetStudentsByAdvisor(int userId)
    {
        return await _context.ClassroomsStudents
            .Include(cs => cs.Student)
            .Include(cs => cs.Classroom)
            .Where(cs => cs.Classroom.AdvisorId == userId)
            .OrderBy(cs => cs.Classroom.GradeLevel)
            .ThenBy(cs => cs.Classroom.Section)
            .ThenBy(cs => cs.Student.Name)
            .Select(cs => new TeacherStudentDto(
                cs.Student.Id,
                cs.Student.Name,
                cs.Classroom.Id,
                cs.Classroom.Subject,
                cs.Classroom.GradeLevel,
                cs.Classroom.Section
            ))
            .ToListAsync();
    }
}
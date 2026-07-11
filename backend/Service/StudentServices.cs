using backend.Data;
using Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using model;
using Model;

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
    public async Task<Student?> InsertStudentInfo(StudentProfileDto dto)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == dto.Id);

        if (student == null)
            return null;

        student.Birthdate = dto.Birthdate;
        student.ContactNumber = dto.ContactNumber;
        student.City = dto.City;
        student.Municipality = dto.Municipality;

        if (dto.ProfileImage != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "profile");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = Guid.NewGuid().ToString() +
                           Path.GetExtension(dto.ProfileImage.FileName);

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ProfileImage.CopyToAsync(stream);
            }

            // Save only the filename
            student.ProfileImage = fileName;
        }

        await _context.SaveChangesAsync();

        return student;
    }
    public async Task<Student> getStudentById(int id)
    {
        var student = await _context.Students
    .FirstOrDefaultAsync(s => s.UserId == id);

        return student;
    }


    public async Task<StudentDashboardDto?> GetStudentDashboard(int userId)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            return null;

        var classes = await _context.Classes
            .Where(c => c.Attendances.Any(a => a.StudentId == student.Id))
            .Include(c => c.Classroom)
                .ThenInclude(c => c.Advisor)
            .Include(c => c.Attendances)
            .ToListAsync();

        var attendance = classes
            .SelectMany(c => c.Attendances
                .Where(a => a.StudentId == student.Id)
                .Select(a => new
                {
                    Class = c,
                    Attendance = a
                }))
            .ToList();

        double attendanceRate = 0;

        if (attendance.Any())
        {
            attendanceRate = attendance.Count(a => a.Attendance.Status == AttendanceStatus.Present)
                * 100.0 /
                attendance.Count;
        }

        return new StudentDashboardDto(
            StudentName: student.Name,
            GradeLevel: classes.FirstOrDefault()?.Classroom.GradeLevel ?? "",
            Section: classes.FirstOrDefault()?.Classroom.Section ?? "",
            EnrolledSubjects: classes
                .Select(c => c.ClassroomId)
                .Distinct()
                .Count(),
            AttendanceRate: attendanceRate,

            TodayClasses: classes
                .Where(c => c.Start.Date == DateTime.Today)
                .OrderBy(c => c.Start)
                .Select(c => new TodayClassDto(
                    c.Id,
                    c.Classroom.Subject,
                    c.Start,
                    c.End,
                    c.Classroom.Advisor.Name
                ))
                .ToList(),

            RecentAttendance: attendance
                .OrderByDescending(a => a.Class.Start)
                .Take(5)
                .Select(a => new StudentAttendanceHistoryDto(
                    a.Class.Classroom.Subject,
                    a.Class.Start,
                    a.Attendance.Status
                ))
                .ToList()
        );
    }
}
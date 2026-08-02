using backend.Data;
using backend.Dtos;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using model;

namespace backend.Services
{
    public class AdminDashboardService
    {
        private readonly AppDbContext _context;

        public AdminDashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardDto> GetDashboard()
        {
            var totalStudents = await _context.Users.CountAsync(u => u.Role == Role.Student);
            var totalTeachers = await _context.Users.CountAsync(u => u.Role == Role.Teacher);
            var totalClassrooms = await _context.Classrooms.CountAsync();
            var totalQuizzes = await _context.Quizzes.CountAsync();
            var totalAssignments = await _context.Assignments.CountAsync();

            var sectionBreakdown = await _context.Classrooms
    .Include(c => c.Advisor)
    .Include(c => c.ClassroomStudents)
    .OrderBy(c => c.GradeLevel)
    .ThenBy(c => c.Section)
    .Select(c => new SectionBreakdownDto(
        c.Id,
        c.GradeLevel,
        c.Section,
        c.Subject,
        c.Advisor.Name,
        c.ClassroomStudents.Count
    ))
    .ToListAsync();

            var gradeBreakdown = sectionBreakdown
                .GroupBy(s => s.GradeLevel)
                .Select(g => new GradeBreakdownDto(g.Key, g.Sum(s => s.StudentCount)))
                .OrderBy(g => g.GradeLevel)
                .ToList();

            return new AdminDashboardDto(
                totalStudents,
                totalTeachers,
                totalClassrooms,
                totalQuizzes,
                totalAssignments,
                sectionBreakdown,
                gradeBreakdown
            );
        }
    }
}
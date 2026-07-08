using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
	public class GradeService : IGradeService
	{
		private readonly AppDbContext _context; // swap for your actual DbContext name

		public GradeService(AppDbContext context)
		{
			_context = context;
		}

		public async Task<List<StudentGradeDto>> GetGradesByClassroomAsync(int classroomId)
		{
			var roster = await _context.ClassroomsStudents
				.Where(cs => cs.ClassroomId == classroomId)
				.Include(cs => cs.Student)
				.ToListAsync();

			var grades = await _context.Grades
				.Where(g => g.ClassroomId == classroomId)
				.ToListAsync();

			var result = roster.Select(cs =>
			{
				var studentGrades = grades.Where(g => g.StudentId == cs.StudentId).ToList();

				return new StudentGradeDto
				{
					StudentId = cs.StudentId,
					StudentName = cs.Student.Name, // adjust to your Student model's name field
					Prelims = studentGrades.FirstOrDefault(g => g.Period == GradePeriod.Prelims)?.Score,
					Midterm = studentGrades.FirstOrDefault(g => g.Period == GradePeriod.Midterm)?.Score,
					Prefinal = studentGrades.FirstOrDefault(g => g.Period == GradePeriod.Prefinal)?.Score,
					Final = studentGrades.FirstOrDefault(g => g.Period == GradePeriod.Final)?.Score,
				};
			}).ToList();

			return result;
		}

		public async Task SaveGradesAsync(SaveGradesRequest request)
		{
			foreach (var item in request.Grades)
			{
				if (!Enum.TryParse<GradePeriod>(item.Period, true, out var period))
					continue; // or throw, depending on how strict you want this

				var existing = await _context.Grades.FirstOrDefaultAsync(g =>
					g.ClassroomId == request.ClassroomId &&
					g.StudentId == item.StudentId &&
					g.Period == period);

				if (existing != null)
				{
					existing.Score = item.Score; // update in place, same idea as your attendance upsert
				}
				else
				{
					_context.Grades.Add(new Grade
					{
						ClassroomId = request.ClassroomId,
						StudentId = item.StudentId,
						Period = period,
						Score = item.Score,
					});
				}
			}

			await _context.SaveChangesAsync();
		}
	}
}
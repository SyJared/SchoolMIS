using backend.DTOs;

namespace backend.Services
{
	public interface IGradeService
	{
		Task<List<StudentGradeDto>> GetGradesByClassroomAsync(int classroomId);
		Task SaveGradesAsync(SaveGradesRequest request);
	}
}
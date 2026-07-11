namespace Dtos;
public record TeacherDashboardDto(
	int ClassId,
	string Subject,
	string GradeLevel,
	string Section,
	DateTime Start,
	DateTime End,
	bool? IsDone,
	List<StudentAttendanceDto> Students
	);

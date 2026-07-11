using Model;
namespace Dtos;
public record StudentAttendanceDto(
	int StudentId,
	string Name,
	AttendanceStatus Status
	);
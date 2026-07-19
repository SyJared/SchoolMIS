using Model;
namespace Dtos;
public record StudentAttendanceDto(
	int StudentId,
	string Name,
	AttendanceStatus Status
	);
public record ForStudentAttendanceDto(
    int StudentId,
    string Name,
    AttendanceStatus Status,
    int ClassId
    );
namespace Dtos;
public record StudentDto(
    int Id,
    string Name
    );

public record StudentClassroomDetailsDto(
    int ClassroomId,
    string Subject,
    string GradeLevel,
    string Section,
    string Advisor,
    List<StudentClassDto> Classes,
    List<ForStudentAttendanceDto> Attendance
);

public record StudentClassDto(
    int ClassId,
    DateTime Start,
    DateTime End,
    bool IsDone
);


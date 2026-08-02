namespace Dtos;

public record ClassroomStudentsDto(
    int StudentId,
    int ClassroomId
    );

public record StudentClassroomDto(
    int ClassroomId,
    string Subject,
    string GradeLevel,
    string Section,
    string Advisor
);
public record ClassroomDto(
    int Id,
    string Subject,
    string GradeLevel,
    string Section
);
public record TeacherStudentDto(
    int StudentId,
    string StudentName,
    int ClassroomId,
    string Subject,
    string GradeLevel,
    string Section
);
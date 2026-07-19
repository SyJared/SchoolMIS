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
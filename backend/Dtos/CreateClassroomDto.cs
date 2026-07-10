namespace Dtos;

public record CreateClassroomDto(
    int AdvisorId,
    string Subject,
    string GradeLevel,
    string Section
    );
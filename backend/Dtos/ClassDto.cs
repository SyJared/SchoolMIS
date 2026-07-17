namespace Dtos;

public record ClassesDto
(
    int ClassroomId,
    DateTime Start,
    DateTime End
);


public record ClassesByStudentIdDto(
    int ClassId,
    string subject,
    string Advisor,
    DateTime Start,
    DateTime end
    );
namespace Dtos;

public record CreateStudentDto(
        string Name,

        string Email,
        string Password
    );
using Microsoft.AspNetCore.Http;

public class CreateAssignmentDto
{
    public int ClassroomId { get; set; }

    public string Title { get; set; }

    public string? Description { get; set; }

    public DateOnly DueDate { get; set; }

    public IFormFile? File { get; set; }
}

public record AssignmentDto(
    int Id,
    string Title,
    string Description,
    DateOnly DueDate,
    string? File
);
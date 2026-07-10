namespace Dtos;

public record StudentProfileDto(
string Municipality,
string City,
DateOnly Birthdate,
string ContactNumber,
IFormFile ProfileImage,
int Id
);
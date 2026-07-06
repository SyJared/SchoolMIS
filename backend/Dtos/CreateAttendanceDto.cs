using Model;

public record AttendanceItemDto(
    int StudentId,
    AttendanceStatus Status
);

public record CreateAttendanceDto(
    int ClassId,
    List<AttendanceItemDto> Attendance
);
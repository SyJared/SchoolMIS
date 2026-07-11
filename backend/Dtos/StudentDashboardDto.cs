using backend.DTOs;
using Dtos;
using Model;

public record StudentDashboardDto(
    string StudentName,
    string GradeLevel,
    string Section,
    int EnrolledSubjects,
    double AttendanceRate,
    List<TodayClassDto> TodayClasses,
    List<StudentAttendanceHistoryDto> RecentAttendance
);
public record TodayClassDto(
    int ClassId,
    string Subject,
    DateTime Start,
    DateTime End,
    string Teacher
);

public record StudentAttendanceHistoryDto(
    string Subject,
    DateTime Date,
    AttendanceStatus Status
);
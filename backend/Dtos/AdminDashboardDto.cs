namespace backend.Dtos
{
    public record AdminDashboardDto(
        int TotalStudents,
        int TotalTeachers,
        int TotalClassrooms,
        int TotalQuizzes,
        int TotalAssignments,
        List<SectionBreakdownDto> SectionBreakdown,
        List<GradeBreakdownDto> GradeBreakdown
    );

    public record SectionBreakdownDto(
        int ClassroomId,
        string GradeLevel,
        string Section,
        string Subject,
        string AdvisorName,
        int StudentCount
    );

    public record GradeBreakdownDto(
        string GradeLevel,
        int StudentCount
    );
}
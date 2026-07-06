using backend.Data;
using Model;

public class AttendanceService{
    private readonly AppDbContext _context;
    public AttendanceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateAttendance(CreateAttendanceDto dto)
    {
        foreach (var item in dto.Attendance)
        {
            _context.Attendance.Add(new Attendance
            {
                ClassId = dto.ClassId,
                StudentId = item.StudentId,
                Status = item.Status
            });
        }

        var rows = await _context.SaveChangesAsync();
        Console.WriteLine($"Rows saved: {rows}");
    }
}
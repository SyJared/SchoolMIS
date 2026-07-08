using backend.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Model;

public class AttendanceService{
    private readonly AppDbContext _context;
    public AttendanceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateAttendance(CreateAttendanceDto dto)
    {
        var classSession = await _context.Classes.FindAsync(dto.ClassId);
        if(classSession == null)
        {
            throw new InvalidOperationException("class not found");
        }
        if (classSession.IsDone == true)
        {
            throw new InvalidOperationException("class already done");
        }
        foreach (var item in dto.Attendance)
        {
            var existing = await _context.Attendance
                .FirstOrDefaultAsync(a =>
                    a.ClassId == dto.ClassId &&
                    a.StudentId == item.StudentId);

            if (existing == null)
            {
                _context.Attendance.Add(new Attendance
                {
                    ClassId = dto.ClassId,
                    StudentId = item.StudentId,
                    Status = item.Status
                });
            }
            else
            {
                existing.Status = item.Status;
            }
        }
     
        await _context.SaveChangesAsync();
    }
    public async Task<List<Attendance>> GetAttendance(int classId)
    {
        return await _context.Attendance
            .Where(a => a.ClassId == classId)
            .Include(a => a.Student)
            .ToListAsync();
    }
}
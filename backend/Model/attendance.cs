using model;

namespace Model;

public class Attendance
{
    public int Id { get; set; }
    public int ClassId { get; set; }
    public Classes Class { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; }
    public AttendanceStatus Status { get; set; }
}
public enum AttendanceStatus
{
    Present,
    Absent,
    Late,
    Excused
}
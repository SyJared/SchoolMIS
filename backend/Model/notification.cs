using model;

public class Notification
{
    public int Id { get; set; }
    public int UserId { get; set; }   
    public Users User { get; set; }
    public string Message { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public NotificationType NotificationType { get; set; }
}
public enum NotificationType{
    ClassCreated,
    ClassDeleted,
    ClassRescheduled,
    Attendance
    }
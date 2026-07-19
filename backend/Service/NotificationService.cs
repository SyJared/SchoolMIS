using backend.Data;
using Microsoft.EntityFrameworkCore;

public class NotificationService
{
    private readonly AppDbContext _context;

    public NotificationService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<Notification> CreateNotification(int UserId, string Message)
    {

        var notif = new Notification
        {
            UserId = UserId,
            NotificationType = NotificationType.ClassCreated,
            Message = Message
        };
        _context.Notifications.AddRange(notif);
        await _context.SaveChangesAsync();
        return notif;
    }

    public async Task ReadNotification(int userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        if (!notifications.Any())
            return;

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
        }

        await _context.SaveChangesAsync();
    }
    public async Task<List<Notification>> GetNotificationById(int userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return notifications;
    }
    public async Task NotifyClassroom(int classroomId,NotificationType type,string message)
    {
        var userIds = await _context.ClassroomsStudents
            .Where(cs => cs.ClassroomId == classroomId)
            .Select(cs => cs.Student.UserId)
            .ToListAsync();

        foreach (var userId in userIds)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = userId,
                NotificationType = type,
                Message = message
            });
        }

        await _context.SaveChangesAsync();
    }
}
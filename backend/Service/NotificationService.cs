using backend.Data;

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
}
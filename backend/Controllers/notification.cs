using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class NotificationController: ControllerBase
    {
        private readonly NotificationService _notificationService;

        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> ReadNotificationByUserId(int UserId)
        {
            await _notificationService.ReadNotification(UserId);
            return Ok();
        }
        [Authorize]
        [HttpGet("{UserId}")]
        public async Task<IActionResult> GetNotification(int UserId)
        {
            var notif = await _notificationService.GetNotificationById(UserId);
            if (notif == null || (notif is ICollection<object> c && c.Count == 0))
            {
                return NotFound();
            }
            return Ok(notif);
        }
    }
}
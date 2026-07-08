using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly AttendanceService _attendanceService;
        public AttendanceController(AttendanceService attendacneService)
        {
            _attendanceService = attendacneService;
        }
        [Authorize(Roles ="Teacher,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateAttendance(CreateAttendanceDto dto)
        {
            try
            {
                await _attendanceService.CreateAttendance(dto);

                return Ok(new
                {
                    message = "Attendance created"
                });
            }
            catch(InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
        [Authorize]
        [HttpGet("{classId}")]
        public async Task<IActionResult> GetAttendanceById(int classId)
        {
            var attendance = await _attendanceService.GetAttendance(classId);
            return Ok(attendance);
        }
    }
}
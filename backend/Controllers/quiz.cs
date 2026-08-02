using backend.Dtos;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly QuizService _quizService;

        public QuizController(QuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuiz([FromBody] CreateQuizDto dto)
        {
            var result = await _quizService.CreateQuiz(dto);
            return Ok(result);
        }

        [HttpGet("classroom/{classroomId}")]
        public async Task<IActionResult> GetQuizzesByClassroom(int classroomId)
        {
            var result = await _quizService.GetQuizzesByClassroom(classroomId);
            return Ok(result);
        }

        [HttpGet("{quizId}/attempts")]
        public async Task<IActionResult> GetQuizAttempts(int quizId)
        {
            var result = await _quizService.GetQuizAttempts(quizId);
            return Ok(result);
        }

        [HttpPatch("{quizId}/publish")]
        public async Task<IActionResult> TogglePublish(int quizId, [FromBody] bool published)
        {
            var success = await _quizService.TogglePublish(quizId, published);
            if (!success) return NotFound();
            return NoContent();
        }
        [HttpGet("{quizId}")]
        public async Task<IActionResult> GetQuizById(int quizId)
        {
            var result = await _quizService.GetQuizById(quizId);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [HttpGet("classroom/{classroomId}/published")]
        public async Task<IActionResult> GetPublishedQuizzesByClassroom(int classroomId)
        {
            var result = await _quizService.GetPublishedQuizzesByClassroom(classroomId);
            return Ok(result);
        }

        [HttpGet("{quizId}/attempted")]
        public async Task<IActionResult> GetExistingAttempt(int quizId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var attempt = await _quizService.GetExistingAttempt(quizId, userId);

            return Ok(new { attempted = attempt != null, attemptId = attempt?.Id });
        }

        [HttpPost("attempt")]
        public async Task<IActionResult> SubmitQuizAttempt([FromBody] SubmitQuizAttemptDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _quizService.SubmitQuizAttempt(dto, userId);

            if (result == null)
                return BadRequest(new { message = "Unable to submit — quiz not found, student not found, or already attempted." });

            return Ok(result);
        }
        [HttpGet("attempt/{attemptId}/result")]
        public async Task<IActionResult> GetAttemptResult(int attemptId)
        {
            var result = await _quizService.GetAttemptResult(attemptId);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}
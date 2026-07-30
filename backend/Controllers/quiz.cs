using Microsoft.AspNetCore.Mvc;
using backend.Dtos;
using backend.Services;

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
    }
}
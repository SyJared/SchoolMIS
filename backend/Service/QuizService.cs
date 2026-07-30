using backend.Data;
using backend.Dtos;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class QuizService
    {
        private readonly AppDbContext _context;

        public QuizService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<QuizDto> CreateQuiz(CreateQuizDto dto)
        {
            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                TimeLimitMinutes = dto.TimeLimitMinutes,
                ShuffleQuestions = dto.ShuffleQuestions,
                ShuffleChoices = dto.ShuffleChoices,
                Published = dto.Published,
                ClassroomId = dto.ClassroomId,
                Questions = dto.Questions.Select(q => new Question
                {
                    QuestionText = q.QuestionText,
                    Type = q.Type,
                    Points = q.Points,
                    Choices = q.Choices?.Select(c => new Choice
                    {
                        Text = c.Text,
                        IsCorrect = c.IsCorrect
                    }).ToList() ?? new List<Choice>()
                }).ToList()
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return new QuizDto(
                quiz.Id, quiz.Title, quiz.Description, quiz.StartDate, quiz.EndDate,
                quiz.TimeLimitMinutes, quiz.ShuffleQuestions, quiz.ShuffleChoices,
                quiz.Published, quiz.ClassroomId, quiz.Questions.Count
            );
        }

        public async Task<List<QuizDto>> GetQuizzesByClassroom(int classroomId)
        {
            return await _context.Quizzes
                .Where(q => q.ClassroomId == classroomId)
                .Select(q => new QuizDto(
                    q.Id, q.Title, q.Description, q.StartDate, q.EndDate,
                    q.TimeLimitMinutes, q.ShuffleQuestions, q.ShuffleChoices,
                    q.Published, q.ClassroomId, q.Questions.Count
                ))
                .ToListAsync();
        }

        public async Task<List<QuizAttemptDto>> GetQuizAttempts(int quizId)
        {
            return await _context.QuizAttempts
                .Where(a => a.QuizId == quizId)
                .Include(a => a.Student)
                .OrderByDescending(a => a.SubmittedAt)   // <-- moved before Select
                .Select(a => new QuizAttemptDto(
                    a.Id,
                    a.StudentId,
                    a.Student.Name,
                    a.StartedAt,
                    a.SubmittedAt,
                    a.Score
                ))
                .ToListAsync();
        }

        public async Task<bool> TogglePublish(int quizId, bool published)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.Id == quizId);
            if (quiz == null) return false;

            quiz.Published = published;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<QuizDetailDto?> GetQuizById(int quizId)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(qq => qq.Choices)
                .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null) return null;

            return new QuizDetailDto(
                quiz.Id,
                quiz.Title,
                quiz.Description,
                quiz.StartDate,
                quiz.EndDate,
                quiz.TimeLimitMinutes,
                quiz.ShuffleQuestions,
                quiz.ShuffleChoices,
                quiz.Published,
                quiz.ClassroomId,
                quiz.Questions.Select(q => new QuestionDto(
                    q.Id,
                    q.QuestionText,
                    q.Type,
                    q.Points,
                    q.Choices.Select(c => new ChoiceDto(c.Id, c.Text, c.IsCorrect)).ToList()
                )).ToList()
            );
        }
    }
}
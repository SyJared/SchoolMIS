using backend.Data;
using backend.Dtos;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using model;

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
        // Students only see published quizzes
        public async Task<List<QuizDto>> GetPublishedQuizzesByClassroom(int classroomId)
        {
            return await _context.Quizzes
                .Where(q => q.ClassroomId == classroomId && q.Published)
                .Select(q => new QuizDto(
                    q.Id, q.Title, q.Description, q.StartDate, q.EndDate,
                    q.TimeLimitMinutes, q.ShuffleQuestions, q.ShuffleChoices,
                    q.Published, q.ClassroomId, q.Questions.Count
                ))
                .ToListAsync();
        }

        public async Task<QuizAttemptResultDto?> SubmitQuizAttempt(SubmitQuizAttemptDto dto, int userId)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null) return null; // no student profile linked to this user

            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Choices)
                .FirstOrDefaultAsync(q => q.Id == dto.QuizId);

            if (quiz == null) return null;

            var alreadyAttempted = await _context.QuizAttempts
                .AnyAsync(a => a.QuizId == dto.QuizId && a.StudentId == student.Id);
            if (alreadyAttempted) return null;

            double score = 0;
            double maxScore = quiz.Questions.Sum(q => q.Points);
            var answers = new List<StudentAnswer>();

            foreach (var ans in dto.Answers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == ans.QuestionId);
                if (question == null) continue;

                bool isAutoGraded = question.Type == QuestionType.MultipleChoice || question.Type == QuestionType.TrueFalse;

                if (isAutoGraded && ans.ChoiceId.HasValue)
                {
                    var choice = question.Choices.FirstOrDefault(c => c.Id == ans.ChoiceId.Value);
                    if (choice != null && choice.IsCorrect)
                    {
                        score += question.Points;
                    }
                }

                answers.Add(new StudentAnswer
                {
                    QuestionId = ans.QuestionId,
                    ChoiceId = ans.ChoiceId,
                    AnswerText = ans.AnswerText
                });
            }

            var attempt = new QuizAttempt
            {
                QuizId = dto.QuizId,
                StudentId = student.Id, // use the actual Student.Id, not the JWT's UserId
                StartedAt = dto.StartedAt,
                SubmittedAt = DateTime.UtcNow,
                Score = score,
                Answers = answers
            };

            _context.QuizAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            return new QuizAttemptResultDto(attempt.Id, score, maxScore);
        }

        public async Task<QuizAttempt?> GetExistingAttempt(int quizId, int userId)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
            if (student == null) return null;

            return await _context.QuizAttempts
                .FirstOrDefaultAsync(a => a.QuizId == quizId && a.StudentId == student.Id);
        }
        public async Task<AttemptResultDetailDto?> GetAttemptResult(int attemptId)
        {
            var attempt = await _context.QuizAttempts
                .Include(a => a.Quiz)
                    .ThenInclude(q => q.Questions)
                        .ThenInclude(q => q.Choices)
                .Include(a => a.Answers)
                .FirstOrDefaultAsync(a => a.Id == attemptId);

            if (attempt == null) return null;

            double maxScore = attempt.Quiz.Questions.Sum(q => q.Points);

            var answerResults = attempt.Quiz.Questions.Select(question =>
            {
                var studentAnswer = attempt.Answers.FirstOrDefault(a => a.QuestionId == question.Id);

                bool isAutoGraded = question.Type == QuestionType.MultipleChoice || question.Type == QuestionType.TrueFalse;

                string? selectedText = null;
                string? correctText = null;
                double earned = 0;
                bool isCorrect = false;

                if (isAutoGraded)
                {
                    var selectedChoice = question.Choices.FirstOrDefault(c => c.Id == studentAnswer?.ChoiceId);
                    var correctChoice = question.Choices.FirstOrDefault(c => c.IsCorrect);

                    selectedText = selectedChoice?.Text;
                    correctText = correctChoice?.Text;
                    isCorrect = selectedChoice != null && selectedChoice.IsCorrect;
                    earned = isCorrect ? question.Points : 0;
                }

                return new AnswerResultDto(
                    question.Id,
                    question.QuestionText,
                    question.Type,
                    question.Points,
                    earned,
                    isCorrect,
                    selectedText,
                    correctText,
                    studentAnswer?.AnswerText
                );
            }).ToList();

            return new AttemptResultDetailDto(
                attempt.Id,
                attempt.Quiz.Title,
                attempt.Score,
                maxScore,
                attempt.SubmittedAt,
                answerResults
            );
        }
    }
}
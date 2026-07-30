using model;

namespace backend.Model
{
    public class Quiz
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int TimeLimitMinutes { get; set; }

        public bool ShuffleQuestions { get; set; }

        public bool ShuffleChoices { get; set; }

        public bool Published { get; set; }

        public int ClassroomId { get; set; }

        public Classroom Classroom { get; set; }

        public ICollection<Question> Questions { get; set; }
    }
    public class Question
    {
        public int Id { get; set; }

        public string QuestionText { get; set; }

        public QuestionType Type { get; set; }

        public int Points { get; set; }

        public int QuizId { get; set; }

        public Quiz Quiz { get; set; }

        public ICollection<Choice> Choices { get; set; }
    }
    public enum QuestionType
    {
        MultipleChoice,
        TrueFalse,
        ShortAnswer,
        Essay
    }
    public class Choice
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public bool IsCorrect { get; set; }

        public int QuestionId { get; set; }

        public Question Question { get; set; }
    }
    public class QuizAttempt
    {
        public int Id { get; set; }

        public int QuizId { get; set; }

        public Quiz Quiz { get; set; }

        public int StudentId { get; set; }

        public Student Student { get; set; }

        public DateTime StartedAt { get; set; }

        public DateTime SubmittedAt { get; set; }

        public double Score { get; set; }

        public ICollection<StudentAnswer> Answers { get; set; }
    }
    public class StudentAnswer
    {
        public int Id { get; set; }

        public int QuizAttemptId { get; set; }

        public QuizAttempt QuizAttempt { get; set; }

        public int QuestionId { get; set; }

        public Question Question { get; set; }

        public int? ChoiceId { get; set; }

        public Choice Choice { get; set; }

        public string? AnswerText { get; set; }
    }
}

using backend.Model;

namespace backend.Dtos
{
    public record CreateChoiceDto(string Text, bool IsCorrect);

    public record CreateQuestionDto(
        string QuestionText,
        QuestionType Type,
        int Points,
        List<CreateChoiceDto>? Choices
    );

    public record CreateQuizDto(
        string Title,
        string Description,
        DateTime StartDate,
        DateTime EndDate,
        int TimeLimitMinutes,
        bool ShuffleQuestions,
        bool ShuffleChoices,
        bool Published,
        int ClassroomId,
        List<CreateQuestionDto> Questions
    );

    public record QuizDto(
        int Id,
        string Title,
        string Description,
        DateTime StartDate,
        DateTime EndDate,
        int TimeLimitMinutes,
        bool ShuffleQuestions,
        bool ShuffleChoices,
        bool Published,
        int ClassroomId,
        int QuestionCount
    );

    public record QuizAttemptDto(
        int Id,
        int StudentId,
        string StudentName,
        DateTime StartedAt,
        DateTime SubmittedAt,
        double Score
    );
    public record QuizDetailDto(
    int Id,
    string Title,
    string Description,
    DateTime StartDate,
    DateTime EndDate,
    int TimeLimitMinutes,
    bool ShuffleQuestions,
    bool ShuffleChoices,
    bool Published,
    int ClassroomId,
    List<QuestionDto> Questions
);

    public record QuestionDto(
        int Id,
        string QuestionText,
        QuestionType Type,
        int Points,
        List<ChoiceDto> Choices
    );

    public record ChoiceDto(int Id, string Text, bool IsCorrect);
}
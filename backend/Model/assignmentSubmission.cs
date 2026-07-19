using model;

namespace backend.Model
{
    public class AssignmemtSubmission
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public Assignments Assignment { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public int? Grade { get; set; }
        public string? Feedback { get; set; }
        public string? FileUrl { get; set; }
    }
}
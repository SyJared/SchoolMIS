using model;

namespace backend.Model
{
    public class Assignments
    {
        public int Id { get; set; }
        public int ClassroomId { get; set; }
        public Classroom Classroom { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? File {  get; set; }
        public DateOnly DueDate { get; set; }
        public DateOnly CreatedAt { get; set; } = new DateOnly();
    }
}
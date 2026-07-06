using model;

namespace Model;

    public class Classes
{
    public int Id { get; set; }
    public int ClassroomId { get; set; }
    public Classroom Classroom { get; set; }

    public DateTime Start { get; set; }
    public DateTime End { get; set; }

    public bool? IsDone { get; set; } = false;      
}
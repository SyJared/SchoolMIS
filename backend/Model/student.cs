using Model;

namespace model;

    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public int UserId { get; set; }
        public Users User { get; set; }
        public string? City { get; set; }
    public string? Municipality { get; set; }
    public DateOnly? Birthdate { get; set; }
    public string? ContactNumber { get; set; }

    public string? ProfileImage {  get; set; }

    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

}

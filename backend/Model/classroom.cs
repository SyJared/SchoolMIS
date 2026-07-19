using backend.Model;
using Model;

namespace model;
public class Classroom
{
    public int Id { get; set; }

    public int AdvisorId { get; set; }
    public Users Advisor { get; set; }
    public string Subject { get; set; }
    public string GradeLevel { get; set; }

    public string Section { get; set; }
    public ICollection<Classes> Classes { get; set; } = new List<Classes>();

    public ICollection<ClassroomStudents> ClassroomStudents { get; set; }
        = new List<ClassroomStudents>();
}
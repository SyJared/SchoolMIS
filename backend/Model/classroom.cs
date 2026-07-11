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

    

}
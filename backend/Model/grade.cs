using model;

namespace backend.Model
{
	public enum GradePeriod
	{
		Prelims,
		Midterm,
		Prefinal,
		Final
	}

	public class Grade
	{
		public int Id { get; set; }
		public int StudentId { get; set; }
		public Student Student { get; set; }
		public int ClassroomId { get; set; }
		public Classroom Classroom { get; set; }
		public GradePeriod Period { get; set; }
		public decimal Score { get; set; } // 0-100
	}
}
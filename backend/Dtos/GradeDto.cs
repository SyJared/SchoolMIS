namespace backend.DTOs
{
	// Sent from client when saving grades
	public class GradeItemDto
	{
		public int StudentId { get; set; }
		public string Period { get; set; } // "Prelims" | "Midterm" | "Prefinal" | "Final"
		public decimal Score { get; set; }
	}

	public class SaveGradesRequest
	{
		public int ClassroomId { get; set; }
		public List<GradeItemDto> Grades { get; set; }
	}

	// Returned to client: one row per student, four period columns
	public class StudentGradeDto
	{
		public int StudentId { get; set; }
		public string StudentName { get; set; }
		public decimal? Prelims { get; set; }
		public decimal? Midterm { get; set; }
		public decimal? Prefinal { get; set; }
		public decimal? Final { get; set; }
	}
}
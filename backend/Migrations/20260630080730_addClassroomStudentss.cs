using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addClassroomStudentss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "studentId",
                table: "ClassroomsStudents",
                newName: "StudentId");

            migrationBuilder.RenameColumn(
                name: "classroomId",
                table: "ClassroomsStudents",
                newName: "ClassroomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "ClassroomsStudents",
                newName: "studentId");

            migrationBuilder.RenameColumn(
                name: "ClassroomId",
                table: "ClassroomsStudents",
                newName: "classroomId");
        }
    }
}

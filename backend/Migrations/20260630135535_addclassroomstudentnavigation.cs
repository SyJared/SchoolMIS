using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addclassroomstudentnavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ClassroomsStudents_ClassroomId",
                table: "ClassroomsStudents",
                column: "ClassroomId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassroomsStudents_StudentId",
                table: "ClassroomsStudents",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassroomsStudents_Classrooms_ClassroomId",
                table: "ClassroomsStudents",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassroomsStudents_Students_StudentId",
                table: "ClassroomsStudents",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassroomsStudents_Classrooms_ClassroomId",
                table: "ClassroomsStudents");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassroomsStudents_Students_StudentId",
                table: "ClassroomsStudents");

            migrationBuilder.DropIndex(
                name: "IX_ClassroomsStudents_ClassroomId",
                table: "ClassroomsStudents");

            migrationBuilder.DropIndex(
                name: "IX_ClassroomsStudents_StudentId",
                table: "ClassroomsStudents");
        }
    }
}

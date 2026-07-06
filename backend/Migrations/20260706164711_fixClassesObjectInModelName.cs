using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class fixClassesObjectInModelName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendance_Classes_ClassesId",
                table: "Attendance");

            migrationBuilder.DropIndex(
                name: "IX_Attendance_ClassesId",
                table: "Attendance");

            migrationBuilder.DropColumn(
                name: "ClassesId",
                table: "Attendance");

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_ClassId",
                table: "Attendance",
                column: "ClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendance_Classes_ClassId",
                table: "Attendance",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendance_Classes_ClassId",
                table: "Attendance");

            migrationBuilder.DropIndex(
                name: "IX_Attendance_ClassId",
                table: "Attendance");

            migrationBuilder.AddColumn<int>(
                name: "ClassesId",
                table: "Attendance",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_ClassesId",
                table: "Attendance",
                column: "ClassesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendance_Classes_ClassesId",
                table: "Attendance",
                column: "ClassesId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

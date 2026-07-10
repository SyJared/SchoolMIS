using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class advisorIdinclassroom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AdvisorId",
                table: "Classrooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UsersId",
                table: "Classrooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Classrooms_UsersId",
                table: "Classrooms",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classrooms_Users_UsersId",
                table: "Classrooms",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classrooms_Users_UsersId",
                table: "Classrooms");

            migrationBuilder.DropIndex(
                name: "IX_Classrooms_UsersId",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "AdvisorId",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "UsersId",
                table: "Classrooms");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class advisorreplacedbyid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classrooms_Users_UsersId",
                table: "Classrooms");

            migrationBuilder.DropIndex(
                name: "IX_Classrooms_UsersId",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "Advisor",
                table: "Classrooms");

            migrationBuilder.RenameColumn(
                name: "UsersId",
                table: "Classrooms",
                newName: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Classrooms_AdvisorId",
                table: "Classrooms",
                column: "AdvisorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classrooms_Users_AdvisorId",
                table: "Classrooms",
                column: "AdvisorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classrooms_Users_AdvisorId",
                table: "Classrooms");

            migrationBuilder.DropIndex(
                name: "IX_Classrooms_AdvisorId",
                table: "Classrooms");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Classrooms",
                newName: "UsersId");

            migrationBuilder.AddColumn<string>(
                name: "Advisor",
                table: "Classrooms",
                type: "text",
                nullable: false,
                defaultValue: "");

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
    }
}

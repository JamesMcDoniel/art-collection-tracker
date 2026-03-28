using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateToEmails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "User",
                newName: "Email");

            migrationBuilder.RenameIndex(
                name: "IX_User_Username",
                table: "User",
                newName: "IX_User_Email");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Email",
                table: "User",
                newName: "Username");

            migrationBuilder.RenameIndex(
                name: "IX_User_Email",
                table: "User",
                newName: "IX_User_Username");
        }
    }
}

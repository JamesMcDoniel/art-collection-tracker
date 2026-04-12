using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedAt", "Disabled", "Email", "FirstName", "LastName", "Notes", "PasswordHash", "RoleId" },
                values: new object[] { 1, new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "default_admin", "Default", "Admin", null, "$2a$11$iQFB86E7X6Mrz6FlOh5Z5.FjIe7nCeS6edrMtLqSE4TEreCmyxDRC", 3 });
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AuthTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    RoleId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Token = table.Column<string>(type: "TEXT", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshToken_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "Title" },
                values: new object[,]
                {
                    { 1, "Curator" },
                    { 2, "Facilities" },
                    { 3, "IT" },
                    { 4, "Guest" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Medium_Type",
                table: "Medium",
                column: "Type",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Location_Location_Name",
                table: "Location",
                column: "Location_Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Loan_Status_Status",
                table: "Loan_Status",
                column: "Status",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Donor_Name",
                table: "Donor",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Collection_Title",
                table: "Collection",
                column: "Title",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Category_Title",
                table: "Category",
                column: "Title",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artist_Name",
                table: "Artist",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_Token",
                table: "RefreshToken",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_UserId",
                table: "RefreshToken",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Role_Title",
                table: "Role",
                column: "Title",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_RoleId",
                table: "User",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Username",
                table: "User",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropIndex(
                name: "IX_Medium_Type",
                table: "Medium");

            migrationBuilder.DropIndex(
                name: "IX_Location_Location_Name",
                table: "Location");

            migrationBuilder.DropIndex(
                name: "IX_Loan_Status_Status",
                table: "Loan_Status");

            migrationBuilder.DropIndex(
                name: "IX_Donor_Name",
                table: "Donor");

            migrationBuilder.DropIndex(
                name: "IX_Collection_Title",
                table: "Collection");

            migrationBuilder.DropIndex(
                name: "IX_Category_Title",
                table: "Category");

            migrationBuilder.DropIndex(
                name: "IX_Artist_Name",
                table: "Artist");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Path = table.Column<string>(type: "TEXT", nullable: false),
                    ContentType = table.Column<string>(type: "TEXT", nullable: false),
                    ExternalReport = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    OmitEstimates = table.Column<bool>(type: "INTEGER", nullable: true),
                    Collection_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Category_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Artist_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Medium_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Location_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Loan_Status_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Donor_Id = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Report_Artist_Artist_Id",
                        column: x => x.Artist_Id,
                        principalTable: "Artist",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Report_Category_Category_Id",
                        column: x => x.Category_Id,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Report_Collection_Collection_Id",
                        column: x => x.Collection_Id,
                        principalTable: "Collection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Report_Donor_Donor_Id",
                        column: x => x.Donor_Id,
                        principalTable: "Donor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Report_Loan_Status_Loan_Status_Id",
                        column: x => x.Loan_Status_Id,
                        principalTable: "Loan_Status",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Report_Location_Location_Id",
                        column: x => x.Location_Id,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Report_Medium_Medium_Id",
                        column: x => x.Medium_Id,
                        principalTable: "Medium",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Report_Artist_Id",
                table: "Report",
                column: "Artist_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Category_Id",
                table: "Report",
                column: "Category_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Collection_Id",
                table: "Report",
                column: "Collection_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Donor_Id",
                table: "Report",
                column: "Donor_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Loan_Status_Id",
                table: "Report",
                column: "Loan_Status_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Location_Id",
                table: "Report",
                column: "Location_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Medium_Id",
                table: "Report",
                column: "Medium_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Report");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FixMediumFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artwork_Medium_MediumId",
                table: "Artwork");

            migrationBuilder.DropIndex(
                name: "IX_Artwork_MediumId",
                table: "Artwork");

            migrationBuilder.DropColumn(
                name: "MediumId",
                table: "Artwork");

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Medium_Id",
                table: "Artwork",
                column: "Medium_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Artwork_Medium_Medium_Id",
                table: "Artwork",
                column: "Medium_Id",
                principalTable: "Medium",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artwork_Medium_Medium_Id",
                table: "Artwork");

            migrationBuilder.DropIndex(
                name: "IX_Artwork_Medium_Id",
                table: "Artwork");

            migrationBuilder.AddColumn<int>(
                name: "MediumId",
                table: "Artwork",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_MediumId",
                table: "Artwork",
                column: "MediumId");

            migrationBuilder.AddForeignKey(
                name: "FK_Artwork_Medium_MediumId",
                table: "Artwork",
                column: "MediumId",
                principalTable: "Medium",
                principalColumn: "Id");
        }
    }
}

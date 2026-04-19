using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DidntSave : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Donor_Name",
                table: "Donor");

            migrationBuilder.DropIndex(
                name: "IX_Artist_Name",
                table: "Artist");

            migrationBuilder.CreateIndex(
                name: "IX_Medium_Slug",
                table: "Medium",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Donor_Name",
                table: "Donor",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Collection_Slug",
                table: "Collection",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Category_Slug",
                table: "Category",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Slug",
                table: "Artwork",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Title",
                table: "Artwork",
                column: "Title",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artist_Name",
                table: "Artist",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artist_Slug",
                table: "Artist",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Medium_Slug",
                table: "Medium");

            migrationBuilder.DropIndex(
                name: "IX_Donor_Name",
                table: "Donor");

            migrationBuilder.DropIndex(
                name: "IX_Collection_Slug",
                table: "Collection");

            migrationBuilder.DropIndex(
                name: "IX_Category_Slug",
                table: "Category");

            migrationBuilder.DropIndex(
                name: "IX_Artwork_Slug",
                table: "Artwork");

            migrationBuilder.DropIndex(
                name: "IX_Artwork_Title",
                table: "Artwork");

            migrationBuilder.DropIndex(
                name: "IX_Artist_Name",
                table: "Artist");

            migrationBuilder.DropIndex(
                name: "IX_Artist_Slug",
                table: "Artist");

            migrationBuilder.CreateIndex(
                name: "IX_Donor_Name",
                table: "Donor",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Artist_Name",
                table: "Artist",
                column: "Name");
        }
    }
}

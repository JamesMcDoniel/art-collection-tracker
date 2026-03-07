using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Artist",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Artist", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Collection",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Collection", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Donor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donor", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Loan_Status",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Status = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Loan_Status", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Location_Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Medium",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Type = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medium", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Artwork",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Asset_Num = table.Column<string>(type: "TEXT", nullable: true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Dimensions = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Retail_Low_Estimate = table.Column<double>(type: "REAL", nullable: true),
                    Retail_High_Estimate = table.Column<double>(type: "REAL", nullable: true),
                    Collection_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Category_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Artist_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Medium_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Location_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Loan_Status_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Donor_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    MediumId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Artwork", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Artwork_Artist_Artist_Id",
                        column: x => x.Artist_Id,
                        principalTable: "Artist",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Artwork_Category_Category_Id",
                        column: x => x.Category_Id,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Artwork_Collection_Collection_Id",
                        column: x => x.Collection_Id,
                        principalTable: "Collection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Artwork_Donor_Donor_Id",
                        column: x => x.Donor_Id,
                        principalTable: "Donor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Artwork_Loan_Status_Loan_Status_Id",
                        column: x => x.Loan_Status_Id,
                        principalTable: "Loan_Status",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Artwork_Location_Location_Id",
                        column: x => x.Location_Id,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Artwork_Medium_MediumId",
                        column: x => x.MediumId,
                        principalTable: "Medium",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Image",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Path = table.Column<string>(type: "TEXT", nullable: false),
                    Embedding = table.Column<string>(type: "TEXT", nullable: false),
                    Artwork_Id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Image", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Image_Artwork_Artwork_Id",
                        column: x => x.Artwork_Id,
                        principalTable: "Artwork",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Artist_Id",
                table: "Artwork",
                column: "Artist_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Asset_Num",
                table: "Artwork",
                column: "Asset_Num",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Category_Id",
                table: "Artwork",
                column: "Category_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Collection_Id",
                table: "Artwork",
                column: "Collection_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Donor_Id",
                table: "Artwork",
                column: "Donor_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Loan_Status_Id",
                table: "Artwork",
                column: "Loan_Status_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_Location_Id",
                table: "Artwork",
                column: "Location_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Artwork_MediumId",
                table: "Artwork",
                column: "MediumId");

            migrationBuilder.CreateIndex(
                name: "IX_Image_Artwork_Id",
                table: "Image",
                column: "Artwork_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Image");

            migrationBuilder.DropTable(
                name: "Artwork");

            migrationBuilder.DropTable(
                name: "Artist");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Collection");

            migrationBuilder.DropTable(
                name: "Donor");

            migrationBuilder.DropTable(
                name: "Loan_Status");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropTable(
                name: "Medium");
        }
    }
}

using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Artwork> Artwork { get; set; }
        public DbSet<Collection> Collection { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<Artist> Artist { get; set; }
        public DbSet<Medium> Medium { get; set; }
        public DbSet<Location> Location { get; set; }
        public DbSet<Loan_Status> Loan_Status { get; set; }
        public DbSet<Donor> Donor { get; set; }
        public DbSet<Image> Image { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ensures Unique Constraint
            modelBuilder.Entity<Artwork>()
                .HasIndex(artwork => artwork.Asset_Num)
                .IsUnique();

            // If a record in one of the lookup tables is deleted
            // (Collection, Category, etc.), set any affected fields in Artwork to null.
            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Collection)
                .WithMany(collection => collection.Artworks)
                .HasForeignKey(artwork => artwork.Collection_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Category)
                .WithMany(category => category.Artworks)
                .HasForeignKey(artwork => artwork.Category_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Artist)
                .WithMany(artist => artist.Artworks)
                .HasForeignKey(artwork => artwork.Artist_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Location)
                .WithMany(location => location.Artworks)
                .HasForeignKey(artwork => artwork.Location_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Loan_Status)
                .WithMany(loan_status => loan_status.Artworks)
                .HasForeignKey(artwork => artwork.Loan_Status_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Donor)
                .WithMany(donor => donor.Artworks)
                .HasForeignKey(artwork => artwork.Donor_Id)
                .OnDelete(DeleteBehavior.SetNull);

            // When an Artwork is deleted, cascade delete related Image(s)
            modelBuilder.Entity<Image>()
                .HasOne(image => image.Artwork)
                .WithMany(artwork => artwork.Images)
                .HasForeignKey(image => image.Artwork_Id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
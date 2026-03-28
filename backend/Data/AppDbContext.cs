using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> User { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<RefreshToken> RefreshToken { get; set; }
        public DbSet<PasswordReset> PasswordReset { get; set; }

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
            // Unique Constraints
            modelBuilder.Entity<User>()
                .HasIndex(user => user.Email)
                .IsUnique();

            modelBuilder.Entity<Role>()
                .HasIndex(role => role.Title)
                .IsUnique();

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(refreshToken => refreshToken.Token)
                .IsUnique();

            modelBuilder.Entity<Artwork>()
                .HasIndex(artwork => artwork.Asset_Num)
                .IsUnique();

            modelBuilder.Entity<Collection>()
                .HasIndex(collection => collection.Title)
                .IsUnique();

            modelBuilder.Entity<Category>()
                .HasIndex(category => category.Title)
                .IsUnique();

            modelBuilder.Entity<Medium>()
                .HasIndex(medium => medium.Type)
                .IsUnique();

            modelBuilder.Entity<Location>()
                .HasIndex(location => location.Location_Name)
                .IsUnique();

            modelBuilder.Entity<Loan_Status>()
                .HasIndex(loanStatus => loanStatus.Status)
                .IsUnique();

            // I'll still add Artist & Donor here for Indexes to speed up lookup,
            // but they won't be Unique, since names aren't necessarily always
            // unique.
            modelBuilder.Entity<Artist>()
                .HasIndex(artist => artist.Name);

            modelBuilder.Entity<Donor>()
                .HasIndex(donor => donor.Name);

            // All Users must have a Role. Restrict prevents a parent record
            // from being deleted while there are still dependent child records
            // linked to it.
            modelBuilder.Entity<User>()
                .HasOne(user => user.Role)
                .WithMany(role => role.Users)
                .HasForeignKey(user => user.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Remove all of a User's refreshTokens if the User is deleted
            modelBuilder.Entity<RefreshToken>()
                .HasOne(refreshToken => refreshToken.User)
                .WithMany(user => user.RefreshTokens)
                .HasForeignKey(refreshToken => refreshToken.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Remove all of a User's password resets if the User is deleted
            modelBuilder.Entity<PasswordReset>()
                .HasOne(passwordReset => passwordReset.User)
                .WithMany(user => user.PasswordResets)
                .HasForeignKey(passwordReset => passwordReset.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // When a lookup table record is deleted, set the associated field
            // in Artwork to null.
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

            // Seed Role Table
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Title = "Curator" },
                new Role { Id = 2, Title = "Facilities" },
                new Role { Id = 3, Title = "IT" },
                new Role { Id = 4, Title = "Guest" }
            );

            // Seed User Table with a Default IT Role Admin Account
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "default_admin",
                    PasswordHash = "$2a$11$iQFB86E7X6Mrz6FlOh5Z5.FjIe7nCeS6edrMtLqSE4TEreCmyxDRC",
                    RoleId = 3
                }
            );
        }
    }
}
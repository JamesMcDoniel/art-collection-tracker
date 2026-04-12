using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        private readonly IWebHostEnvironment? _env;
        public AppDbContext(DbContextOptions<AppDbContext> options, IWebHostEnvironment env)
            : base(options)
        {
            _env = env;
        }

        public DbSet<User> User { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<RefreshToken> RefreshToken { get; set; }
        public DbSet<PasswordReset> PasswordReset { get; set; }
        public DbSet<Report> Report { get; set; }

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
            // in Artwork and Reports to null.
            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Collection)
                .WithMany(collection => collection.Artworks)
                .HasForeignKey(artwork => artwork.Collection_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Report>()
                .HasOne(report => report.Collection)
                .WithMany(collection => collection.Reports)
                .HasForeignKey(report => report.Collection_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Category)
                .WithMany(category => category.Artworks)
                .HasForeignKey(artwork => artwork.Category_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Report>()
                .HasOne(report => report.Category)
                .WithMany(category => category.Reports)
                .HasForeignKey(report => report.Category_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Artist)
                .WithMany(artist => artist.Artworks)
                .HasForeignKey(artwork => artwork.Artist_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Report>()
                .HasOne(report => report.Artist)
                .WithMany(artist => artist.Reports)
                .HasForeignKey(report => report.Artist_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Medium)
                .WithMany(medium => medium.Artworks)
                .HasForeignKey(artwork => artwork.Medium_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Report>()
                .HasOne(report => report.Medium)
                .WithMany(medium => medium.Reports)
                .HasForeignKey(report => report.Medium_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Location)
                .WithMany(location => location.Artworks)
                .HasForeignKey(artwork => artwork.Location_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Report>()
                .HasOne(report => report.Location)
                .WithMany(location => location.Reports)
                .HasForeignKey(report => report.Location_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Loan_Status)
                .WithMany(loan_status => loan_status.Artworks)
                .HasForeignKey(artwork => artwork.Loan_Status_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Report>()
                .HasOne(report => report.Loan_Status)
                .WithMany(loan_status => loan_status.Reports)
                .HasForeignKey(report => report.Loan_Status_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Artwork>()
                .HasOne(artwork => artwork.Donor)
                .WithMany(donor => donor.Artworks)
                .HasForeignKey(artwork => artwork.Donor_Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Report>()
                .HasOne(report => report.Donor)
                .WithMany(donor => donor.Reports)
                .HasForeignKey(report => report.Donor_Id)
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
        }

        public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            // Get the paths of any Image entities being deleted
            var imagesToDelete = ChangeTracker.Entries<Image>()
                .Where(e => e.State == EntityState.Deleted)
                .Select(e => e.Entity.Path)
                .Where(path => !string.IsNullOrWhiteSpace(path))
                .Select(path => path!)
                .ToList();

            // Get the paths of any Report entities being deleted
            var reportsToDelete = ChangeTracker.Entries<Report>()
                .Where(e => e.State == EntityState.Deleted)
                .Select(e => e.Entity.Path)
                .Where(path => !string.IsNullOrWhiteSpace(path))
                .ToList();

            // Let the original Save go through
            var result = await base.SaveChangesAsync(ct);

            if (_env?.WebRootPath != null)
            {
                var imagesFolder = Path.Combine(_env.WebRootPath, "uploads");
                DeleteFiles(imagesFolder, imagesToDelete);
            }

            var reportsFolder = Path.Combine(Directory.GetCurrentDirectory(), "reports");
            DeleteFiles(reportsFolder, reportsToDelete);

            return result;
        }

        private void DeleteFiles(string folder, List<string> paths)
        {
            foreach (var path in paths)
            {
                try
                {
                    var fullPath = Path.Combine(folder, Path.GetFileName(path));
                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                    }
                }
                catch (Exception exception)
                {
                    // I don't quite want the whole app to crash should this
                    // get hung up on a file, so I'll catch and just log it to
                    // console
                    Console.WriteLine(exception.Message);
                }
            }
        }
    }
}
using backend.Data;
using backend.Models;

public static class DatabaseSeed
{
    public static void Seed(AppDbContext context)
    {
        if (!context.User.Any(user => user.Role!.Title == "IT"))
        {
            context.User.Add(new User
            {
                Email = "default_admin",
                PasswordHash = "$2a$11$iQFB86E7X6Mrz6FlOh5Z5.FjIe7nCeS6edrMtLqSE4TEreCmyxDRC",
                FirstName = "Default",
                LastName = "Admin",
                CreatedAt = DateTime.UtcNow,
                Disabled = false,
                RoleId = 3
            });

            context.SaveChanges();
        }
    }
}
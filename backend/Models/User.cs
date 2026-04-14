namespace backend.Models
{
    public class User
    {
        public int Id { get; set; } // PK
        public string Email { get; set; } = string.Empty;
        public string? PasswordHash { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Disabled { get; set; }

        // Foreign Key
        public int RoleId { get; set; }

        // Relationships
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public ICollection<PasswordReset> PasswordResets { get; set; } = new List<PasswordReset>();
        public Role? Role { get; set; }
    }
}
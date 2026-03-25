namespace backend.Models
{
    public class User
    {
        public int Id { get; set; } // PK
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // Foreign Key
        public int RoleId { get; set; }

        // Relationships
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public Role? Role { get; set; }
    }
}
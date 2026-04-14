namespace backend.Models
{
    public class PasswordReset
    {
        public int Id { get; set; } // PK
        public string Token { get; set; } = string.Empty;
        public DateTimeOffset ExpiresAt { get; set; }
        public bool isUsed { get; set; }

        public bool IsExpired => DateTimeOffset.UtcNow >= ExpiresAt;

        // Foreign Key
        public int UserId { get; set; }

        // Relationship
        public User? User { get; set; }
    }
}
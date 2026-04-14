namespace backend.Models
{
    public class RefreshToken
    {
        public int Id { get; set; } // PK
        public string Token { get; set; } = string.Empty;
        public DateTimeOffset ExpiresAt { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? RevokedAt { get; set; }

        public bool IsExpired => DateTimeOffset.UtcNow >= ExpiresAt;
        public bool IsRevoked => RevokedAt != null;
        public bool IsActive => !IsExpired && !IsRevoked;

        // Foreign Key
        public int UserId { get; set; }

        // Relationship
        public User? User { get; set; }
    }
}
namespace backend.Models
{
    public class RefreshToken
    {
        public int Id { get; set; } // PK
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? RevokedAt { get; set; }

        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        public bool IsRevoked => RevokedAt != null;
        public bool IsActive => !IsExpired && !IsRevoked;

        // Foreign Key
        public int UserId { get; set; }

        // Relationship
        public User? User { get; set; }
    }
}
namespace backend.Models
{
    public class Role
    {
        public int Id { get; set; } // PK
        public string Title { get; set; } = string.Empty;

        // Relationship
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
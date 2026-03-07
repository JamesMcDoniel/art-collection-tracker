namespace backend.Models
{
    public class Category
    {
        public int Id { get; set; } // PK
        public string Title { get; set; } = string.Empty;

        // Relationship
        public ICollection<Artwork> Artworks { get; set; } = new List<Artwork>();
    }
}
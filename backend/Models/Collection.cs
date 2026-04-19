namespace backend.Models
{
    public class Collection
    {
        public int Id { get; set; } // PK
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;


        // Relationship
        public ICollection<Artwork> Artworks { get; set; } = new List<Artwork>();
        public ICollection<Report> Reports { get; set; } = new List<Report>();
    }
}
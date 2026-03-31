namespace backend.Models
{
    public class Donor
    {
        public int Id { get; set; } // PK
        public string Name { get; set; } = string.Empty;

        // Relationship
        public ICollection<Artwork> Artworks { get; set; } = new List<Artwork>();
        public ICollection<Report> Reports { get; set; } = new List<Report>();
    }
}
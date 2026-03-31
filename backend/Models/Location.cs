namespace backend.Models
{
    public class Location
    {
        public int Id { get; set; } // PK
        public string Location_Name { get; set; } = string.Empty;

        // Relationship
        public ICollection<Artwork> Artworks { get; set; } = new List<Artwork>();
        public ICollection<Report> Reports { get; set; } = new List<Report>();
    }
}
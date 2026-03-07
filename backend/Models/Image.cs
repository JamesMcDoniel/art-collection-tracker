namespace backend.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string Path { get; set; } = string.Empty;
        public string Embedding { get; set; } = string.Empty;

        // Foreign Key
        public int Artwork_Id { get; set; }

        // Relationship
        public Artwork? Artwork { get; set; }
    }
}
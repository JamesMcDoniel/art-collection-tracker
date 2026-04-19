public class PublicArtworkResponseDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Artist { get; set; }
    public string? ArtistSlug { get; set; }
    public List<string> Images { get; set; } = new List<string>();
}
public class PublicImageRecommendationDto
{
    public PublicMetadataDto RandomImage { get; set; } = new();
    public List<PublicMetadataDto> Recommendations { get; set; } = new();
}
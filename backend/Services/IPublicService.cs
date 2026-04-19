public interface IPublicService
{
    Task<PublicResponseDto<PublicTypeDto>> GetGalleryTypes(PublicTypeQueryDto query);
    Task<PublicResponseDto<PublicResultDto>> GetGalleryResults(PublicResultQueryDto query);
    Task<PublicArtworkResponseDto?> GetArtwork(string slug);
    Task<PublicImageRecommendationDto?> GetRecommendedImages(int numResults = 9);
    Task<List<PublicMetadataDto>> GetRandomImages(PublicImageQueryDto query);
}
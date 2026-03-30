using backend.Models;

public interface IArtworkService
{
    Task<List<ArtworkResponseDto>> GetAllArtwork();
    Task<ArtworkResponseDto?> GetArtworkById(int id);
    Task<int> CreateArtwork(ArtworkDto dto);
    Task<Artwork?> UpdateArtwork(int id, ArtworkDto dto);
    Task<Artwork?> UpdateLocation(int id, string? location);
    Task DeleteArtwork(int id);
    Task<FilterDto> GetAllFilters();

    // I'm not sure how to make these a more generic and
    // universal method instead of each being separate
    Task<Collection?> GetOrCreateCollection(string? title);
    Task<Category?> GetOrCreateCategory(string? title);
    Task<Artist?> GetOrCreateArtist(string? name);
    Task<Medium?> GetOrCreateMedium(string? type);
    Task<Location?> GetOrCreateLocation(string? location);
    Task<Loan_Status?> GetOrCreateLoanStatus(string? status);
    Task<Donor?> GetOrCreateDonor(string? name);
}
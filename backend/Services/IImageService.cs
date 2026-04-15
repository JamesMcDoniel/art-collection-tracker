public interface IImageService
{
    Task<string?> SaveImage(IFormFile file);
    Task UploadArtworkImage(int id, IFormFile file);
    Task UploadSpreadsheetImage(IFormFile file);
    Task<List<ImageDto>> GetImagesByArtworkId(int id);
    Task DeleteArtworkImages(List<int> imageIds);
    string GenerateImageEmbeddings(string fileName);
    string SanitizeFileName(string fileName);
}
using backend.Models;

public interface IImageService
{
    Task<string?> SaveImage(IFormFile file);
    Task UploadArtworkImages(int id, List<IFormFile> files);
    Task UploadSpreadsheetImages(IFormFile file);
    Task DeleteArtworkImages(List<int> imageIds);
    string GenerateImageEmbeddings(string fileName);
    string SanitizeFileName(string fileName);
}
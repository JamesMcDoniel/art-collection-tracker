using backend.Models;

public interface IImageService
{
    Task<string?> SaveImage(IFormFile file);
    Task UploadArtworkImages(Artwork artwork, List<IFormFile> files);
    Task UploadSpreadsheetImages(List<IFormFile> files);
    string GenerateImageEmbeddings(string fileName);
    string SanitizeFileName(string fileName);
}
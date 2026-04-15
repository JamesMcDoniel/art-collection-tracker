using backend.Data;
using backend.Models;
using DocumentFormat.OpenXml.InkML;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
using Microsoft.ML.Data;

public class ImageService : IImageService
{
    private readonly AppDbContext _context;
    private readonly MLContext _mlContext;
    private readonly ITransformer _model;
    private readonly string _uploadFolder;

    public ImageService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _mlContext = new MLContext();

        // Pre-load the Model Pipeline
        var baseDir = AppContext.BaseDirectory;
        var modelPath = Path.Combine(baseDir, "Models", "resnet50-v1-7.onnx");
        _model = SetupModelPipeline(modelPath);

        // Define the path to Uploads folder, and if it doesn't exist,
        // create it
        _uploadFolder = Path.Combine(env.WebRootPath, "uploads");

        if (!Directory.Exists(_uploadFolder))
        {
            Directory.CreateDirectory(_uploadFolder);
        }
    }

    public async Task<string?> SaveImage(IFormFile file)
    {
        if (file.Length == 0)
        {
            return null;
        }

        // Generate a new file name, and designate a target destination for that file
        // on the filesystem.
        var newFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var fullPath = Path.Combine(_uploadFolder, newFileName);

        // Stream the image from memory to the filesystem destination
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return newFileName;
    }

    public async Task UploadArtworkImage(int id, IFormFile file)
    {
        if (file == null || file.Length == 0) return;

        var artwork = await _context.Artwork
            .Include(artwork => artwork.Images)
            .FirstOrDefaultAsync(artwork => artwork.Id == id);

        if (artwork == null)
        {
            throw new Exception($"Artwork with ID: {id}, not found");
        }

        var fileName = await SaveImage(file);

        if (fileName != null)
        {
            artwork.Images.Add(new Image
            {
                Path = Path.Combine("uploads", fileName),
                Embedding = GenerateImageEmbeddings(fileName)
            });

            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<ImageDto>> GetImagesByArtworkId(int id)
    {
        return await _context.Image
            .Where(image => image.Artwork_Id == id && image.Path != null)
            .Select(image => new ImageDto
            {
                Id = image.Id,
                Path = $"/{image.Path}"
            })
            .ToListAsync();
    }

    public async Task DeleteArtworkImages(List<int> imageIds)
    {
        if (imageIds == null || !imageIds.Any())
        {
            return;
        }

        var imagesToDelete = await _context.Image
            .Where(image => imageIds.Contains(image.Id))
            .ToListAsync();

        if (!imagesToDelete.Any())
        {
            return;
        }

        _context.Image.RemoveRange(imagesToDelete);
        await _context.SaveChangesAsync();
    }

    public async Task UploadSpreadsheetImage(IFormFile file)
    {
        if (file == null || file.Length == 0) return;

        var fileName = Path.GetFileNameWithoutExtension(file.FileName).Trim().Replace(" ", "_").ToLower();
        var image = await _context.Image.FirstOrDefaultAsync(image => image.Original_Name == fileName);

        if (image == null) return;

        using var transaction = await _context.Database.BeginTransactionAsync();
        string? savedFilePath = null;

        try
        {
            var newFileName = await SaveImage(file);
            if (newFileName == null) throw new Exception("Save Failed");

            savedFilePath = Path.Combine(_uploadFolder, newFileName);

            image.Path = Path.Combine("uploads", newFileName);
            image.Embedding = GenerateImageEmbeddings(newFileName);
            image.Original_Name = null;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();

            // Delete Orphaned file, if one was created
            if (savedFilePath != null && File.Exists(savedFilePath))
            {
                File.Delete(savedFilePath);
            }

            throw;
        }
    }

    public string GenerateImageEmbeddings(string fileName)
    {
        var imagePath = Path.Combine(_uploadFolder, fileName);

        var data = new List<ImageData>
        {
            new ImageData { ImagePath = imagePath }
        };
        var dataView = _mlContext.Data.LoadFromEnumerable(data);

        var transformed = _model.Transform(dataView);

        var embeddings = _mlContext.Data
            .CreateEnumerable<ImageEmbedding>(transformed, reuseRowObject: false)
            .First();

        return System.Text.Json.JsonSerializer.Serialize(embeddings.resnetv17_dense0_fwd);
    }

    public string SanitizeFileName(string fileName)
    {
        // Replace any illegal characters, like angle brackets and pipe, etc.
        foreach (var c in Path.GetInvalidFileNameChars())
        {
            fileName = fileName.Replace(c, '_');
        }

        // Finally, replace any spaces with underscores
        return fileName.Replace(' ', '_');
    }

    private class ImageEmbedding
    {
        [VectorType(2048)]
        public float[] resnetv17_dense0_fwd { get; set; } = null!;
    }

    private class ImageData
    {
        public string? ImagePath { get; set; }
    }

    private ITransformer SetupModelPipeline(string modelPath)
    {
        var pipeline = _mlContext.Transforms.LoadImages(
            outputColumnName: "data",
            imageFolder: "",
            inputColumnName: nameof(ImageData.ImagePath)
        )
        .Append(_mlContext.Transforms.ResizeImages("data", 224, 224, "data"))
        .Append(_mlContext.Transforms.ExtractPixels("data"))
        .Append(_mlContext.Transforms.ApplyOnnxModel(
            modelFile: modelPath,
            outputColumnNames: new[] { "resnetv17_dense0_fwd" },
            inputColumnNames: new[] { "data" }
        ));

        return pipeline.Fit(_mlContext.Data.LoadFromEnumerable(new List<ImageData>()));
    }
}
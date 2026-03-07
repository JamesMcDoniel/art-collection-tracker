using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms.Image;
using System.Drawing;
using backend.Data;
using backend.Models;

namespace backend.Contollers
{
    public class UploadDTO
    {
        public IFormFile? File { get; set; }
        public int Artwork_Id { get; set; }
    }

    [ApiController]
    [Route("api/image")]
    public class ImageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ImageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage([FromForm] UploadDTO request)
        {
            // Check if a file was even sent
            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest(new { message = "Invalid File" });
            }

            // Validate file extension
            string[] allowedExtensions = [".png"]; // Only .png for now, will expand later
            string extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Invalid File Type" });
            }

            // Create the Uploads folder if it doesn't already exist
            string uploadsFolder = Path.Combine("wwwroot", "uploads");
            Directory.CreateDirectory(uploadsFolder);

            // Create a file on filesystem to copy image over to
            string fileName = $"{Guid.NewGuid()}{extension}";
            string filePath = Path.Combine(uploadsFolder, fileName);

            // Copy Image to Filesystem
            using (FileStream stream = new FileStream(filePath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            // Generate Image Embedding
            float[] embedding = GetImageEmbedding(filePath);
            string serializedEmbedding = System.Text.Json.JsonSerializer.Serialize(embedding);

            Image image = new Image
            {
                Path = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}",
                Artwork_Id = request.Artwork_Id,
                Embedding = serializedEmbedding
            };

            _context.Image.Add(image);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Success" });
        }

        [HttpGet]
        public async Task<IActionResult> GetRecommendedImages()
        {
            List<Image> images = _context.Image.ToList();
            int numResults = 1; // This will eventually be a parameter

            if (images.Count == 0)
            {
                return NotFound(new { message = "No Images Found" });
            }

            // Generate a random number, and use it to pick a random image
            Random randomNumber = new Random();
            Image randomImage = images[randomNumber.Next(images.Count)];

            // Deserialize the stored Embedding
            float[] chosenEmbedding = System.Text.Json.JsonSerializer
                .Deserialize<float[]>(randomImage.Embedding)!;

            // Parse other images' embeddings and perform cosine similarity
            var similarImages = images
                .Where(image => image.Id != randomImage.Id)
                .Select(image =>
                {
                    float[] currentEmbedding = System.Text.Json.JsonSerializer
                        .Deserialize<float[]>(image.Embedding)!;

                    return new
                    {
                        Image = image,
                        Score = CosignSimilarity(chosenEmbedding, currentEmbedding)
                    };
                })
                .OrderByDescending(image => image.Score)
                .Take(numResults)
                .Select(image => new { image.Image.Path })
                .ToList();

            // Instead of just the File Paths, this will eventually return the Path
            // plus part of the Image object, for each of the selected items.

            return Ok(new
            {
                Image = randomImage.Path,
                Recommendations = similarImages
            });
        }

        // TODO: Move these to Services later
        public class ImageEmbedding
        {
            [VectorType(2048)]
            public float[] resnetv17_dense0_fwd { get; set; } = null!;
        }

        private class ImageData
        {
            public string? ImagePath { get; set; }
        }

        private float[] GetImageEmbedding(string imagePath)
        {
            string modelPath = Path.Combine(AppContext.BaseDirectory, "Models", "resnet50-v1-7.onnx");
            MLContext mlContext = new MLContext();

            List<ImageData> data = new List<ImageData>
            {
                new ImageData { ImagePath = imagePath }
            };
            IDataView dataView = mlContext.Data.LoadFromEnumerable(data);

            var pipeline = mlContext.Transforms.LoadImages(
                outputColumnName: "data",
                imageFolder: "",
                inputColumnName: nameof(ImageData.ImagePath)
            )
            .Append(mlContext.Transforms.ResizeImages(
                outputColumnName: "data",
                imageWidth: 224,
                imageHeight: 224,
                inputColumnName: "data"))
            .Append(mlContext.Transforms.ExtractPixels("data"))
            .Append(mlContext.Transforms.ApplyOnnxModel(
                modelFile: modelPath,
                outputColumnNames: new[] { "resnetv17_dense0_fwd" },
                inputColumnNames: new[] { "data" }
            ));

            var transformer = pipeline.Fit(dataView);
            var transformed = transformer.Transform(dataView);

            ImageEmbedding embeddings = mlContext.Data
                .CreateEnumerable<ImageEmbedding>(transformed, reuseRowObject: false)
                .First();

            return embeddings.resnetv17_dense0_fwd;
        }

        private float CosignSimilarity(float[] a, float[] b)
        {
            float dot = 0f;
            float normA = 0f;
            float normB = 0f;

            for (int i = 0; i < a.Length; i++)
            {
                dot += a[i] * b[i];
                normA += a[i] * a[i];
                normB += b[i] * b[i];
            }

            return dot / ((float)Math.Sqrt(normA) * (float)Math.Sqrt(normB));
        }
    }
}
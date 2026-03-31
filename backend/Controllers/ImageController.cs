using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Filters;
using Microsoft.AspNetCore.Authorization;

namespace backend.Contollers
{
    [ApiController]
    [Route("api/image")]
    public class ImageController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IImageService _imageService;

        public ImageController(AppDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> images)
        {
            try
            {
                await _imageService.UploadSpreadsheetImages(images);
                return Ok();
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
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
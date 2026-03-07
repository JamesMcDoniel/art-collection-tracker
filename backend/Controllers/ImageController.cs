using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            using FileStream stream = new FileStream(filePath, FileMode.Create);
            await request.File.CopyToAsync(stream);

            // Do the Embedding Here

            Image image = new Image
            {
                Path = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}",
                Artwork_Id = request.Artwork_Id
                // Embedding = ...
            };

            _context.Image.Add(image);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Success" });
        }
    }

}
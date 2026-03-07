using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/artwork")]
    public class ArtworkController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArtworkController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewArtwork([FromBody] Artwork request)
        {
            Artwork artwork = new Artwork
            {
                // Only title is required, so that's all this will do for now.
                Title = request.Title
            };

            _context.Artwork.Add(artwork);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Success" });
        }
    }
}
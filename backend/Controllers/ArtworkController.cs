using Microsoft.AspNetCore.Mvc;
using backend.Filters;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/artwork")]
    public class ArtworkController : ControllerBase
    {
        private readonly IArtworkService _artworkService;
        private readonly ISpreadsheetService _spreadsheetService;

        public ArtworkController(IArtworkService artworkService, ISpreadsheetService spreadsheetService)
        {
            _artworkService = artworkService;
            _spreadsheetService = spreadsheetService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllArtwork()
        {
            try
            {
                var artworks = await _artworkService.GetAllArtwork();
                return Ok(artworks);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArtworkById(int id)
        {
            try
            {
                var artwork = await _artworkService.GetArtworkById(id);
                return Ok(artwork);
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpPost]
        public async Task<IActionResult> CreateArtwork([FromBody] ArtworkDto dto)
        {
            try
            {
                var artwork_id = await _artworkService.CreateArtwork(dto);
                return CreatedAtAction(nameof(GetArtworkById), new { id = artwork_id }, artwork_id);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpPost("spreadsheet")]
        public async Task<IActionResult> UploadArtworkSpreadsheet([FromForm] IFormFile file)
        {
            try
            {
                await _spreadsheetService.UploadSpreadsheet(file);
                return Ok();
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArtwork(int id, [FromBody] ArtworkDto dto)
        {
            try
            {
                await _artworkService.UpdateArtwork(id, dto);
                return Ok();
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [Authorize(Roles = "Facilities")]
        [ValidateCSRFToken]
        [HttpPatch("{id}/location")]
        public async Task<IActionResult> UpdateLocation(int id, UpdateLocationDto dto)
        {
            try
            {
                await _artworkService.UpdateLocation(id, dto.Location);
                return NoContent();
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtwork(int id)
        {
            try
            {
                await _artworkService.DeleteArtwork(id);
                return NoContent();
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }

        [Authorize(Roles = "Curator,Facilities")]
        [HttpGet("filters")]
        public async Task<IActionResult> GetAllFilters()
        {
            try
            {
                var response = await _artworkService.GetAllFilters();
                return Ok(response);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}
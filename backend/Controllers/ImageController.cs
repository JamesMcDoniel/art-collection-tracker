using Microsoft.AspNetCore.Mvc;
using backend.Filters;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/image")]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpPost("{id}")]
        public async Task<IActionResult> UploadImage(int id, [FromForm] IFormFile image)
        {
            try
            {
                await _imageService.UploadArtworkImage(id, image);
                return Ok();
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpPost("spreadsheet")]
        public async Task<IActionResult> UploadSpreadsheetImages([FromForm] IFormFile image)
        {
            try
            {
                await _imageService.UploadSpreadsheetImage(image);
                return Ok();
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [Authorize(Roles = "Curator")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetImagesByArtworkId(int id)
        {
            try
            {
                var response = await _imageService.GetImagesByArtworkId(id);
                return Ok(response);
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpDelete]
        public async Task<IActionResult> DeleteImages([FromBody] List<int> ids)
        {
            try
            {
                await _imageService.DeleteArtworkImages(ids);
                return NoContent();
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}
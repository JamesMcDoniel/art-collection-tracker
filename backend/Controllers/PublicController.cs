using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/public")]
    [EnableCors("PublicGallery")]
    public class PublicController : ControllerBase
    {
        private readonly IPublicService _publicService;

        public PublicController(IPublicService publicService)
        {
            _publicService = publicService;
        }

        [HttpGet("gallery/types")]
        public async Task<IActionResult> GetGalleryTypes([FromQuery] PublicTypeQueryDto query)
        {
            try
            {
                var response = await _publicService.GetGalleryTypes(query);
                return Ok(response);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpGet("gallery/results")]
        public async Task<IActionResult> GetGalleryResults([FromQuery] PublicResultQueryDto query)
        {
            try
            {
                var response = await _publicService.GetGalleryResults(query);
                return Ok(response);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpGet("artwork/{slug}")]
        public async Task<IActionResult> GetArtwork(string slug)
        {
            try
            {
                var response = await _publicService.GetArtwork(slug);

                if (response == null)
                {
                    return NotFound();
                }

                return Ok(response);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpGet("recommendations")]
        public async Task<IActionResult> GetRecommendedImages()
        {
            try
            {
                var response = await _publicService.GetRecommendedImages();

                if (response == null)
                {
                    return NotFound();
                }

                return Ok(response);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandomImages([FromQuery] PublicImageQueryDto query)
        {
            try
            {
                var response = await _publicService.GetRandomImages(query);
                return Ok(response);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}
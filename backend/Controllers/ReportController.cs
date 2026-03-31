using backend.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/report")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpPost]
        public async Task<IActionResult> CreateReport(ReportRequestDto dto)
        {
            try
            {
                var response = await _reportService.CreateReport(dto);
                return Ok(response);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [Authorize(Roles = "Curator")]
        [ValidateCSRFToken]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadReport(IFormFile report)
        {
            try
            {
                await _reportService.UploadReport(report);
                return Ok();
            }
            catch (Exception exception)
            {
                return Conflict(exception.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReports()
        {
            try
            {
                var response = await _reportService.GetAllReports();
                return Ok(response);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [Authorize(Roles = "Curator")]
        [HttpGet("{id}/preview")]
        public async Task<IActionResult> GetReportPreview(int id)
        {
            try
            {
                var response = await _reportService.PreviewReport(id);
                return Ok(response);
            }
            catch (FileNotFoundException exception)
            {
                return NotFound(exception.Message);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }

        }

        [Authorize(Roles = "Curator")]
        [HttpGet("{id}/download")]
        public async Task<IActionResult> DownloadReport(int id)
        {
            try
            {
                var response = await _reportService.ProcessReportDownload(id);
                return File(response.Content, response.ContentType, response.FileName);
            }
            catch (Exception exception)
            {
                return NotFound(exception.Message);
            }
        }
    }
}
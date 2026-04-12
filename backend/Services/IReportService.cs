public interface IReportService
{
    Task<int> CreateReport(ReportRequestDto dto);
    string GenerateReportFile(List<ReportDto> report);
    Task UploadReports(List<IFormFile> files);
    Task<List<ReportListDto>> GetAllReports();
    Task<List<ReportDto>> PreviewReport(int id);
    Task<ReportDownloadDto> ProcessReportDownload(int id);
    Task DeleteReport(int id);
}
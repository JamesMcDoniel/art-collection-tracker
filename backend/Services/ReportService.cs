using backend.Data;
using backend.Models;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;
    private readonly ISpreadsheetService _spreadsheetService;
    private readonly string _reportsFolder;

    public ReportService(AppDbContext context, ISpreadsheetService spreadsheetService)
    {
        _context = context;
        _spreadsheetService = spreadsheetService;

        // Create the Reports folder if it doesn't already exist.
        _reportsFolder = Path.Combine(Directory.GetCurrentDirectory(), "reports");
        if (!Directory.Exists(_reportsFolder))
        {
            Directory.CreateDirectory(_reportsFolder);
        }
    }

    public async Task<int> CreateReport(ReportRequestDto dto)
    {
        var filePath = GenerateReportFile(dto.Data);

        // I need the actual representation of the filter strings
        var collection = await _context.Collection
            .FirstOrDefaultAsync(collection => collection.Title == dto.Filters.Collection);
        var category = await _context.Category
            .FirstOrDefaultAsync(category => category.Title == dto.Filters.Category);
        var artist = await _context.Artist
            .FirstOrDefaultAsync(artist => artist.Name == dto.Filters.Artist);
        var medium = await _context.Medium
            .FirstOrDefaultAsync(medium => medium.Type == dto.Filters.Medium);
        var location = await _context.Location
            .FirstOrDefaultAsync(location => location.Location_Name == dto.Filters.Location);
        var loan_status = await _context.Loan_Status
            .FirstOrDefaultAsync(loan_status => loan_status.Status == dto.Filters.Loan_Status);
        var donor = await _context.Donor
            .FirstOrDefaultAsync(donor => donor.Name == dto.Filters.Donor);

        var report = new Report
        {
            Title = Path.GetFileNameWithoutExtension(filePath),
            Path = filePath,
            CreatedAt = DateTime.UtcNow,
            ContentType = "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
            ExternalReport = false,
            OmitEstimates = dto.Filters.OmitEstimates,

            Collection = collection,
            Category = category,
            Artist = artist,
            Medium = medium,
            Location = location,
            Loan_Status = loan_status,
            Donor = donor
        };

        _context.Report.Add(report);
        await _context.SaveChangesAsync();

        return report.Id;
    }

    public string GenerateReportFile(List<ReportDto> report)
    {
        var fileName = $"Report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.xlsx";
        var fullPath = Path.Combine(_reportsFolder, fileName);

        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add(DateTime.Now.ToString("yyyy-MM-dd"));

            // WTF!? This automatically builds the headers based off my objects'
            // properties, then adds the data of the objects as rows. It's that easy!
            worksheet.Cell(1, 1).InsertTable(report);

            workbook.SaveAs(fullPath);
        }

        return fullPath;
    }

    public async Task UploadReport(IFormFile file)
    {
        var newPath = Path.Combine(_reportsFolder, file.FileName);

        if (File.Exists(newPath))
        {
            throw new Exception("Report with this name already exists");
        }

        using (var stream = new FileStream(newPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var report = new Report
        {
            Title = Path.GetFileNameWithoutExtension(newPath),
            Path = newPath,
            ContentType = file.ContentType,
            CreatedAt = DateTime.UtcNow,
            ExternalReport = true
        };

        _context.Report.Add(report);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ReportListDto>> GetAllReports()
    {
        var reports = await _context.Report
            .Select(report => new ReportListDto
            {
                Id = report.Id,
                Title = report.Title,
                ExternalReport = report.ExternalReport,
                OmitEstimates = report.OmitEstimates != null ? report.OmitEstimates : null,
                Collection = report.Collection != null ? report.Collection.Title : null,
                Category = report.Category != null ? report.Category.Title : null,
                Artist = report.Artist != null ? report.Artist.Name : null,
                Medium = report.Medium != null ? report.Medium.Type : null,
                Location = report.Location != null ? report.Location.Location_Name : null,
                Loan_Status = report.Loan_Status != null ? report.Loan_Status.Status : null,
                Donor = report.Donor != null ? report.Donor.Name : null
            })
            .ToListAsync();

        return reports;
    }

    public async Task<List<ReportDto>> PreviewReport(int id)
    {
        var report = await _context.Report.FindAsync(id);

        if (report == null || !File.Exists(report.Path))
        {
            throw new FileNotFoundException("Report not found");
        }

        if (report.ExternalReport)
        {
            throw new Exception("Unable to preview externally uploaded reports");
        }

        var results = new List<ReportDto>();

        using (var workbook = new XLWorkbook(report.Path))
        {
            var worksheet = workbook.Worksheets.First();

            var headerRow = worksheet.Row(1);
            var columnMap = headerRow.Cells()
                .ToDictionary(
                    cell => cell.GetString().Trim().ToLower(),
                    cell => cell.Address.ColumnNumber
                );

            foreach (var row in worksheet.RowsUsed().Skip(1))
            {
                var artwork = new ReportDto
                {
                    Asset_Num = _spreadsheetService.ValidateString(row, columnMap, "asset_num"),
                    Title = _spreadsheetService.ValidateRequiredString(row, columnMap, "title"),
                    Dimensions = _spreadsheetService.ValidateString(row, columnMap, "dimensions"),
                    Description = _spreadsheetService.ValidateString(row, columnMap, "description"),
                    Retail_Low_Estimate = _spreadsheetService.ValidateDouble(row, columnMap, "retail_low_estimate"),
                    Retail_High_Estimate = _spreadsheetService.ValidateDouble(row, columnMap, "retail_high_estimate"),
                    Collection = _spreadsheetService.ValidateString(row, columnMap, "collection"),
                    Category = _spreadsheetService.ValidateString(row, columnMap, "category"),
                    Artist = _spreadsheetService.ValidateString(row, columnMap, "artist"),
                    Medium = _spreadsheetService.ValidateString(row, columnMap, "medium"),
                    Location = _spreadsheetService.ValidateString(row, columnMap, "location"),
                    Loan_Status = _spreadsheetService.ValidateString(row, columnMap, "loan_status"),
                    Donor = _spreadsheetService.ValidateString(row, columnMap, "donor")
                };

                results.Add(artwork);
            }
        }

        return results;
    }

    public async Task<ReportDownloadDto> ProcessReportDownload(int id)
    {
        var report = await _context.Report.FindAsync(id);

        if (report == null || !File.Exists(report.Path))
        {
            throw new Exception("File not found");
        }

        var bytes = await File.ReadAllBytesAsync(report.Path);

        return new ReportDownloadDto
        {
            Content = bytes,
            ContentType = report.ContentType ?? "application/octet-stream",
            FileName = Path.GetFileName(report.Path)
        };
    }
}
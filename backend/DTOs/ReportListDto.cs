using backend.Models;

public class ReportListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool ExternalReport { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool? OmitEstimates { get; set; }

    public string? Collection { get; set; }
    public string? Category { get; set; }
    public string? Artist { get; set; }
    public string? Medium { get; set; }
    public string? Location { get; set; }
    public string? Loan_Status { get; set; }
    public string? Donor { get; set; }
}
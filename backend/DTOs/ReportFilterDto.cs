public class ReportFilterDto
{
    public string? Collection { get; set; }
    public string? Category { get; set; }
    public string? Artist { get; set; }
    public string? Medium { get; set; }
    public string? Location { get; set; }
    public string? Loan_Status { get; set; }
    public string? Donor { get; set; }
    public bool OmitEstimates { get; set; }
}
public class ArtworkResponseDto
{
    public int Id { get; set; }
    public string? Asset_Num { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Dimensions { get; set; }
    public double? Retail_Low_Estimate { get; set; }
    public double? Retail_High_Estimate { get; set; }

    public string? Collection { get; set; }
    public string? Category { get; set; }
    public string? Artist { get; set; }
    public string? Medium { get; set; }
    public string? Location { get; set; }
    public string? Loan_Status { get; set; }
    public string? Donor { get; set; }

    public List<ImageDto>? Images { get; set; }
}
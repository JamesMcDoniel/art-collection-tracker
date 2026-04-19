public class PublicResultQueryDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;

    public string? Artist { get; set; }
    public string? Collection { get; set; }
    public string? Category { get; set; }
    public string? Medium { get; set; }
}
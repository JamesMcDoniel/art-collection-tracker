public class ReportRequestDto
{
    public List<ReportDto> Data { get; set; } = new List<ReportDto>();
    public ReportFilterDto Filters { get; set; } = new ReportFilterDto();
}
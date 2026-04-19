public class PublicResponseDto<T>
{
    public int TotalCount { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public List<T> Items { get; set; } = new();
}
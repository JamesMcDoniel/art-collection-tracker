using ClosedXML.Excel;

public interface ISpreadsheetService
{
    Task UploadSpreadsheet(IFormFile file);
    string? ValidateString(IXLRow row, Dictionary<string, int> columnMap, string columnName);
    string ValidateRequiredString(IXLRow row, Dictionary<string, int> columnMap, string columnName);
    double? ValidateDouble(IXLRow row, Dictionary<string, int> columnMap, string columnName);
}
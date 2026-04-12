using backend.Data;
using backend.Models;
using ClosedXML.Excel;

public class SpreadsheetService : ISpreadsheetService
{
    private readonly AppDbContext _context;
    private readonly IArtworkService _artworkService;

    private readonly Dictionary<string, Collection?> _collectionCache = new Dictionary<string, Collection?>();
    private readonly Dictionary<string, Category?> _categoryCache = new Dictionary<string, Category?>();
    private readonly Dictionary<string, Artist?> _artistCache = new Dictionary<string, Artist?>();
    private readonly Dictionary<string, Medium?> _mediumCache = new Dictionary<string, Medium?>();
    private readonly Dictionary<string, Location?> _locationCache = new Dictionary<string, Location?>();
    private readonly Dictionary<string, Loan_Status?> _loanStatusCache = new Dictionary<string, Loan_Status?>();
    private readonly Dictionary<string, Donor?> _donorCache = new Dictionary<string, Donor?>();

    public SpreadsheetService(AppDbContext context, IArtworkService artworkService)
    {
        _context = context;
        _artworkService = artworkService;
    }

    public async Task UploadSpreadsheet(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new Exception("File is empty");
        }

        var extension = Path.GetExtension(file.FileName).ToLower();

        if (extension != ".xls" && extension != ".xlsx")
        {
            throw new Exception("Invalid file type, must be '.xls' or '.xlsx'");
        }

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);
        stream.Position = 0;

        try
        {
            await ProcessSpreadsheet(stream);
        }
        catch (Exception exception)
        {
            throw new Exception(exception.Message);
        }
    }

    private async Task ProcessSpreadsheet(Stream stream)
    {
        // Start a database transaction
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // Open the Workbook
            using var workbook = new XLWorkbook(stream);

            // Search for Table names found in provided .AccDB schema
            var inventorySheet = workbook.Worksheets
                .FirstOrDefault(worksheet => worksheet.Name.Equals("tblInventory", StringComparison.OrdinalIgnoreCase));
            var imageSheet = workbook.Worksheets
                .FirstOrDefault(worksheet => worksheet.Name.Equals("tblInventoryPicture", StringComparison.OrdinalIgnoreCase));

            if (inventorySheet == null || imageSheet == null)
            {
                throw new Exception("One or more required sheets missing");
            }

            // Process Sheets
            var artworkMap = await ProcessInventorySheet(inventorySheet);
            ProcessImageSheet(imageSheet, artworkMap);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception exception)
        {
            // If something goes wrong, Rollback the transaction
            await transaction.RollbackAsync();

            // Re-Throw what ever exception caused it
            throw new Exception(exception.Message);
        }
    }

    private async Task<Dictionary<int, Artwork>> ProcessInventorySheet(IXLWorksheet sheet)
    {
        // Since I can't guarantee the order of columns, I'll add them to
        // dictionary. This maps the column number to the name, so I can
        // access the columns by name instead.
        var headerRow = sheet.Row(1);
        var columnMap = headerRow.Cells()
            .ToDictionary(
                cell => cell.GetString().Trim().ToLower(),
                cell => cell.Address.ColumnNumber
            );

        // There's no way the IDs would ever match between the
        // AccDB and this App, but we can still use the old ID to
        // map the tblInventoryPicture images to the correct Artwork
        var map = new Dictionary<int, Artwork>();

        // Loop through the Sheet's records
        foreach (var row in sheet.RowsUsed().Skip(1))
        {
            // Extract the original records' Id
            var originalId = row.Cell(columnMap["inventoryid"]).GetValue<int>();

            // Create a new Artwork object with data from Row
            var artwork = new Artwork
            {
                Asset_Num = ValidateString(row, columnMap, "assetnum"),
                Title = ValidateRequiredString(row, columnMap, "title"),
                Dimensions = ValidateString(row, columnMap, "dimensions"),
                Description = ValidateString(row, columnMap, "briefdescription"),
                Retail_Low_Estimate = ValidateDouble(row, columnMap, "retaillowestimate"),
                Retail_High_Estimate = ValidateDouble(row, columnMap, "retailhighestimate"),
                Collection = await CacheCollection(ValidateString(row, columnMap, "collection")),
                Category = await CacheCategory(ValidateString(row, columnMap, "category")),
                Artist = await CacheArtist(ValidateString(row, columnMap, "artist")),
                Medium = await CacheMedium(ValidateString(row, columnMap, "medium")),
                Location = await CacheLocation(ValidateString(row, columnMap, "location")),
                Loan_Status = await CacheLoanStatus(ValidateString(row, columnMap, "loanstatus")),
                Donor = await CacheDonor(ValidateString(row, columnMap, "donorname"))
            };

            _context.Artwork.Add(artwork);

            map[originalId] = artwork;
        }

        return map;
    }

    private void ProcessImageSheet(IXLWorksheet sheet, Dictionary<int, Artwork> artworkMap)
    {
        // Again, map the Column Names to Index, so we can
        // Call the specific column by name.
        var headerRow = sheet.Row(1);
        var columnMap = headerRow.Cells()
            .ToDictionary(
                cell => cell.GetString().Trim().ToLower(),
                cell => cell.Address.ColumnNumber
            );

        foreach (var row in sheet.RowsUsed().Skip(1))
        {
            // Image table's Foreign Key, used to match Artwork
            var imageFK = row.Cell(columnMap["inventorylink"]).GetValue<int>();

            if (!artworkMap.TryGetValue(imageFK, out var artwork))
            {
                continue;
            }

            var image = new Image
            {
                Original_Name = NormalizeFileName(row, columnMap, "picturepath"),
                Artwork = artwork // NAVIGATION PROPERTY!!! This automatically links the FKeys in DB!
            };

            _context.Image.Add(image);
        }
    }

    public string? ValidateString(IXLRow row, Dictionary<string, int> columnMap, string columnName)
    {
        if (!columnMap.ContainsKey(columnName))
        {
            return null;
        }

        var value = row.Cell(columnMap[columnName]).GetString()?.Trim();

        return string.IsNullOrWhiteSpace(value) ? null : value;
    }

    public string ValidateRequiredString(IXLRow row, Dictionary<string, int> columnMap, string columnName)
    {
        var value = ValidateString(row, columnMap, columnName);

        if (string.IsNullOrWhiteSpace(value))
        {
            throw new Exception("Missing required value");
        }

        return value;
    }

    public double? ValidateDouble(IXLRow row, Dictionary<string, int> columnMap, string columnName)
    {
        if (!columnMap.ContainsKey(columnName))
        {
            return null;
        }

        var cell = row.Cell(columnMap[columnName]);

        if (cell.TryGetValue<double>(out var number))
        {
            return number;
        }

        return null;
    }

    private string NormalizeFileName(IXLRow row, Dictionary<string, int> columnMap, string columnName)
    {
        var value = ValidateRequiredString(row, columnMap, columnName);

        return Path.GetFileNameWithoutExtension(value).Trim().Replace(" ", "_").ToLower();
    }

    private async Task<Collection?> CacheCollection(string? title)
    {
        // If the title is null, just return null
        if (string.IsNullOrWhiteSpace(title))
        {
            return null;
        }

        // Check the Cache dictionary for the given title, if it's
        // there, return the cached value.
        if (_collectionCache.TryGetValue(title, out var cached))
        {
            return cached;
        }

        // If the title wasn't cached, then go ahead and run the query
        var collection = await _artworkService.GetOrCreateCollection(title);

        // Cache the results, so next time it will be there
        _collectionCache[title] = collection;

        return collection;
    }

    private async Task<Category?> CacheCategory(string? title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return null;
        }

        if (_categoryCache.TryGetValue(title, out var cached))
        {
            return cached;
        }

        var category = await _artworkService.GetOrCreateCategory(title);

        _categoryCache[title] = category;

        return category;
    }

    private async Task<Artist?> CacheArtist(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return null;
        }

        if (_artistCache.TryGetValue(name, out var cached))
        {
            return cached;
        }

        var artist = await _artworkService.GetOrCreateArtist(name);

        _artistCache[name] = artist;

        return artist;
    }

    private async Task<Medium?> CacheMedium(string? type)
    {
        if (string.IsNullOrWhiteSpace(type))
        {
            return null;
        }

        if (_mediumCache.TryGetValue(type, out var cached))
        {
            return cached;
        }

        var medium = await _artworkService.GetOrCreateMedium(type);

        _mediumCache[type] = medium;

        return medium;
    }

    private async Task<Location?> CacheLocation(string? _location)
    {
        if (string.IsNullOrWhiteSpace(_location))
        {
            return null;
        }

        if (_locationCache.TryGetValue(_location, out var cached))
        {
            return cached;
        }

        var location = await _artworkService.GetOrCreateLocation(_location);

        _locationCache[_location] = location;

        return location;
    }

    private async Task<Loan_Status?> CacheLoanStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return null;
        }

        if (_loanStatusCache.TryGetValue(status, out var cached))
        {
            return cached;
        }

        var loanStatus = await _artworkService.GetOrCreateLoanStatus(status);

        _loanStatusCache[status] = loanStatus;

        return loanStatus;
    }

    private async Task<Donor?> CacheDonor(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return null;
        }

        if (_donorCache.TryGetValue(name, out var cached))
        {
            return cached;
        }

        var donor = await _artworkService.GetOrCreateDonor(name);

        _donorCache[name] = donor;

        return donor;
    }
}
using System.Runtime.CompilerServices;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class ArtworkService : IArtworkService
{
    private readonly AppDbContext _context;
    private readonly IImageService _imageService;

    public ArtworkService(AppDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    public async Task<List<ArtworkResponseDto>> GetAllArtwork()
    {
        var artworks = await _context.Artwork
            .Select(artwork => new ArtworkResponseDto
            {
                Id = artwork.Id,
                Asset_Num = artwork.Asset_Num,
                Title = artwork.Title,
                Description = artwork.Description,
                Dimensions = artwork.Dimensions,
                Retail_Low_Estimate = artwork.Retail_Low_Estimate,
                Retail_High_Estimate = artwork.Retail_High_Estimate,

                Collection = artwork.Collection != null ? artwork.Collection.Title : null,
                Category = artwork.Category != null ? artwork.Category.Title : null,
                Artist = artwork.Artist != null ? artwork.Artist.Name : null,
                Medium = artwork.Medium != null ? artwork.Medium.Type : null,
                Location = artwork.Location != null ? artwork.Location.Location_Name : null,
                Loan_Status = artwork.Loan_Status != null ? artwork.Loan_Status.Status : null,
                Donor = artwork.Donor != null ? artwork.Donor.Name : null,

                ImagePaths = artwork.Images
                            .Select(image => "/" + image.Path)
                            .ToList()
            })
            .ToListAsync();

        return artworks;
    }

    public async Task<ArtworkResponseDto?> GetArtworkById(int id)
    {
        var artwork = await _context.Artwork
            .Where(artwork => artwork.Id == id)
            .Select(artwork => new ArtworkResponseDto
            {
                Id = artwork.Id,
                Asset_Num = artwork.Asset_Num,
                Title = artwork.Title,
                Description = artwork.Description,
                Dimensions = artwork.Dimensions,
                Retail_Low_Estimate = artwork.Retail_Low_Estimate,
                Retail_High_Estimate = artwork.Retail_High_Estimate,

                Collection = artwork.Collection != null ? artwork.Collection.Title : null,
                Category = artwork.Category != null ? artwork.Category.Title : null,
                Artist = artwork.Artist != null ? artwork.Artist.Name : null,
                Medium = artwork.Medium != null ? artwork.Medium.Type : null,
                Location = artwork.Location != null ? artwork.Location.Location_Name : null,
                Loan_Status = artwork.Loan_Status != null ? artwork.Loan_Status.Status : null,
                Donor = artwork.Donor != null ? artwork.Donor.Name : null,

                ImagePaths = artwork.Images
                    .Select(image => "/" + image.Path)
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (artwork == null)
        {
            throw new Exception("Artwork not found");
        }

        return artwork;
    }

    public async Task<int> CreateArtwork(ArtworkDto dto)
    {
        var artwork = new Artwork
        {
            Asset_Num = dto.Asset_Num,
            Title = dto.Title,
            Description = dto.Description,
            Dimensions = dto.Dimensions,
            Retail_Low_Estimate = dto.Retail_Low_Estimate,
            Retail_High_Estimate = dto.Retail_High_Estimate,

            // Directly targeting the Navigation Properties
            Collection = await GetOrCreateCollection(dto.Collection),
            Category = await GetOrCreateCategory(dto.Category),
            Artist = await GetOrCreateArtist(dto.Artist),
            Medium = await GetOrCreateMedium(dto.Medium),
            Location = await GetOrCreateLocation(dto.Location),
            Loan_Status = await GetOrCreateLoanStatus(dto.Loan_Status),
            Donor = await GetOrCreateDonor(dto.Donor)
        };

        if (dto.Images != null)
        {
            await _imageService.UploadArtworkImages(artwork, dto.Images);
        }

        _context.Artwork.Add(artwork);
        await _context.SaveChangesAsync();

        return artwork.Id;
    }

    public async Task<Artwork?> UpdateArtwork(int id, ArtworkDto dto)
    {
        var artwork = await _context.Artwork
            .FirstOrDefaultAsync(artwork => artwork.Id == id);

        if (artwork == null)
        {
            throw new Exception("Artwork not found");
        }

        // Update all of the fields on the found Artwork with those from the
        // DTO.
        artwork.Asset_Num = dto.Asset_Num;
        artwork.Title = dto.Title;
        artwork.Description = dto.Description;
        artwork.Dimensions = dto.Dimensions;
        artwork.Retail_Low_Estimate = dto.Retail_Low_Estimate;
        artwork.Retail_High_Estimate = dto.Retail_High_Estimate;

        // Again, use Navigation Properties to Update the Relationships directly
        artwork.Collection = await GetOrCreateCollection(dto.Collection);
        artwork.Category = await GetOrCreateCategory(dto.Category);
        artwork.Artist = await GetOrCreateArtist(dto.Artist);
        artwork.Medium = await GetOrCreateMedium(dto.Medium);
        artwork.Location = await GetOrCreateLocation(dto.Location);
        artwork.Loan_Status = await GetOrCreateLoanStatus(dto.Loan_Status);
        artwork.Donor = await GetOrCreateDonor(dto.Donor);

        await _context.SaveChangesAsync();
        return artwork;
    }

    public async Task<Artwork?> UpdateLocation(int id, string? location)
    {
        var artwork = await _context.Artwork
            .FirstOrDefaultAsync(artwork => artwork.Id == id);

        if (artwork == null)
        {
            throw new Exception("Artwork not found");
        }

        artwork.Location = await GetOrCreateLocation(location);

        await _context.SaveChangesAsync();
        return artwork;
    }

    public async Task DeleteArtwork(int id)
    {
        var artwork = await _context.Artwork
            .FirstOrDefaultAsync(artwork => artwork.Id == id);

        if (artwork == null)
        {
            throw new Exception("Artwork not found");
        }

        _context.Artwork.Remove(artwork);
        await _context.SaveChangesAsync();
    }

    // Get All Lookup Table data. Used for filters and Combobox dropdown menus.
    public async Task<FilterDto> GetAllFilters()
    {
        var collections = _context.Collection
            .Select(collection => collection.Title)
            .OrderBy(title => title)
            .ToListAsync();

        var categories = _context.Category
            .Select(categorie => categorie.Title)
            .OrderBy(title => title)
            .ToListAsync();

        var artists = _context.Artist
            .Select(artist => artist.Name)
            .OrderBy(name => name)
            .ToListAsync();

        var mediums = _context.Medium
            .Select(medium => medium.Type)
            .OrderBy(type => type)
            .ToListAsync();

        var locations = _context.Location
            .Select(location => location.Location_Name)
            .OrderBy(location => location)
            .ToListAsync();

        var loan_statuses = _context.Loan_Status
            .Select(loan_status => loan_status.Status)
            .OrderBy(status => status)
            .ToListAsync();

        var donors = _context.Donor
            .Select(donor => donor.Name)
            .OrderBy(name => name)
            .ToListAsync();

        await Task
            .WhenAll(collections, categories, artists, mediums, locations, loan_statuses, donors);

        return new FilterDto
        {
            Collections = await collections,
            Categories = await categories,
            Artists = await artists,
            Mediums = await mediums,
            Locations = await locations,
            Loan_Statuses = await loan_statuses,
            Donors = await donors
        };
    }

    // These methods all work the same way: If given null, they just return
    // null to be added to the database, otherwise, if the item exists, return
    // the item's id. However, if the item doesn't already exist, add it to the
    // lookup table, then return it's id.

    public async Task<Collection?> GetOrCreateCollection(string? title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return null;
        }

        var collection = await _context.Collection
            .FirstOrDefaultAsync(collection => collection.Title == title);

        if (collection != null)
        {
            return collection;
        }

        var newCollection = new Collection
        {
            Title = title
        };
        _context.Collection.Add(newCollection);

        return newCollection;
    }
    public async Task<Category?> GetOrCreateCategory(string? title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return null;
        }

        var category = await _context.Category
            .FirstOrDefaultAsync(category => category.Title == title);

        if (category != null)
        {
            return category;
        }

        var newCategory = new Category
        {
            Title = title
        };
        _context.Category.Add(newCategory);

        return newCategory;
    }
    public async Task<Artist?> GetOrCreateArtist(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return null;
        }

        var artist = await _context.Artist
            .FirstOrDefaultAsync(artist => artist.Name == name);

        if (artist != null)
        {
            return artist;
        }

        var newArtist = new Artist
        {
            Name = name
        };
        _context.Artist.Add(newArtist);

        return newArtist;
    }
    public async Task<Medium?> GetOrCreateMedium(string? type)
    {
        if (string.IsNullOrWhiteSpace(type))
        {
            return null;
        }

        var medium = await _context.Medium
            .FirstOrDefaultAsync(medium => medium.Type == type);

        if (medium != null)
        {
            return medium;
        }

        var newMedium = new Medium
        {
            Type = type
        };
        _context.Medium.Add(newMedium);

        return newMedium;
    }
    public async Task<Location?> GetOrCreateLocation(string? location)
    {
        if (string.IsNullOrWhiteSpace(location))
        {
            return null;
        }

        var _location = await _context.Location
            .FirstOrDefaultAsync(_location => _location.Location_Name == location);

        if (_location != null)
        {
            return _location;
        }

        var newLocation = new Location
        {
            Location_Name = location
        };
        _context.Location.Add(newLocation);

        return newLocation;
    }
    public async Task<Loan_Status?> GetOrCreateLoanStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return null;
        }

        var loan_status = await _context.Loan_Status
            .FirstOrDefaultAsync(loan_status => loan_status.Status == status);

        if (loan_status != null)
        {
            return loan_status;
        }

        var newLoan_Status = new Loan_Status
        {
            Status = status
        };
        _context.Loan_Status.Add(newLoan_Status);

        return newLoan_Status;
    }
    public async Task<Donor?> GetOrCreateDonor(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return null;
        }

        var donor = await _context.Donor
            .FirstOrDefaultAsync(donor => donor.Name == name);

        if (donor != null)
        {
            return donor;
        }

        var newDonor = new Donor
        {
            Name = name
        };
        _context.Donor.Add(newDonor);

        return newDonor;
    }
}
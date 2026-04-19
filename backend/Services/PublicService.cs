using backend.Data;
using Microsoft.EntityFrameworkCore;

public class PublicService : IPublicService
{
    private readonly AppDbContext _context;

    public PublicService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PublicResponseDto<PublicTypeDto>> GetGalleryTypes(PublicTypeQueryDto query)
    {
        var normalizedType = query.Type.ToLower();

        IQueryable<PublicTypeDto>? data = normalizedType switch
        {
            "artist" => _context.Artist
                .Where(artist => artist.Artworks.Any(artwork =>
                    artwork.Images.Any(image => image.Path != null)
                ))
                .OrderBy(artist => artist.Name)
                .Select(artist => new PublicTypeDto
                {
                    Name = artist.Name,
                    Slug = artist.Slug,
                    Thumbnail = artist.Artworks
                        .SelectMany(artwork => artwork.Images)
                        .Where(image => image.Path != null)
                        .OrderBy(image => EF.Functions.Random())
                        .Select(image => image.Path)
                        .FirstOrDefault()
                }),

            "collection" => _context.Collection
                .Where(collection => collection.Artworks.Any(artwork =>
                    artwork.Images.Any(image => image.Path != null)
                ))
                .OrderBy(collection => collection.Title)
                .Select(collection => new PublicTypeDto
                {
                    Name = collection.Title,
                    Slug = collection.Slug,
                    Thumbnail = collection.Artworks
                        .SelectMany(artwork => artwork.Images)
                        .Where(image => image.Path != null)
                        .OrderBy(image => EF.Functions.Random())
                        .Select(image => image.Path)
                        .FirstOrDefault()
                }),

            "category" => _context.Category
                .Where(category => category.Artworks.Any(artwork =>
                    artwork.Images.Any(image => image.Path != null)
                ))
                .OrderBy(category => category.Title)
                .Select(category => new PublicTypeDto
                {
                    Name = category.Title,
                    Slug = category.Slug,
                    Thumbnail = category.Artworks
                        .SelectMany(artwork => artwork.Images)
                        .Where(image => image.Path != null)
                        .OrderBy(image => EF.Functions.Random())
                        .Select(image => image.Path)
                        .FirstOrDefault()
                }),

            "medium" => _context.Medium
                .Where(medium => medium.Artworks.Any(artwork =>
                    artwork.Images.Any(image => image.Path != null)
                ))
                .OrderBy(medium => medium.Type)
                .Select(medium => new PublicTypeDto
                {
                    Name = medium.Type,
                    Slug = medium.Slug,
                    Thumbnail = medium.Artworks
                        .SelectMany(artwork => artwork.Images)
                        .Where(image => image.Path != null)
                        .OrderBy(image => EF.Functions.Random())
                        .Select(image => image.Path)
                        .FirstOrDefault()
                }),

            _ => null
        };

        if (data == null)
        {
            return new PublicResponseDto<PublicTypeDto>
            {
                TotalCount = 0,
                Page = query.Page,
                PageSize = query.PageSize,
                Items = new List<PublicTypeDto>()
            };
        }

        var totalCount = await data.CountAsync();

        var items = await data
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new PublicResponseDto<PublicTypeDto>
        {
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize,
            Items = items
        };
    }

    public async Task<PublicResponseDto<PublicResultDto>> GetGalleryResults(PublicResultQueryDto query)
    {
        var artworks = _context.Artwork
            .Where(artwork => artwork.Images
                .Any(image => image.Path != null))
            .AsQueryable();

        if (!string.IsNullOrEmpty(query.Artist))
        {
            artworks = artworks
                .Where(artwork => artwork.Artist != null && artwork.Artist.Slug == query.Artist);
        }
        if (!string.IsNullOrEmpty(query.Collection))
        {
            artworks = artworks
                .Where(artwork => artwork.Collection != null && artwork.Collection.Slug == query.Collection);
        }
        if (!string.IsNullOrEmpty(query.Category))
        {
            artworks = artworks
                .Where(artwork => artwork.Category != null && artwork.Category.Slug == query.Category);
        }
        if (!string.IsNullOrEmpty(query.Medium))
        {
            artworks = artworks
                .Where(artwork => artwork.Medium != null && artwork.Medium.Slug == query.Medium);
        }

        var totalCount = await artworks.CountAsync();

        var items = await artworks
            .OrderBy(artwork => artwork.Title)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(artwork => new PublicResultDto
            {
                Title = artwork.Title,
                Slug = artwork.Slug,
                Artist = artwork.Artist != null ? artwork.Artist.Name : null,
                ImagePath = artwork.Images
                    .Where(image => image.Path != null)
                    .OrderBy(image => image.Id)
                    .Select(image => image.Path)
                    .FirstOrDefault()
            })
            .ToListAsync();

        return new PublicResponseDto<PublicResultDto>
        {
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize,
            Items = items
        };
    }

    public async Task<PublicArtworkResponseDto?> GetArtwork(string slug)
    {
        var artwork = await _context.Artwork
            .Where(artwork => artwork.Slug == slug)
            .Select(artwork => new PublicArtworkResponseDto
            {
                Title = artwork.Title,
                Slug = artwork.Slug,
                Artist = artwork.Artist != null ? artwork.Artist.Name : null,
                ArtistSlug = artwork.Artist != null ? artwork.Artist.Slug : null,
                Images = artwork.Images
                    .Where(image => image.Path != null)
                    .Select(image => image.Path!)
                    .ToList()
            })
            .FirstOrDefaultAsync();

        return artwork;
    }

    public async Task<PublicImageRecommendationDto?> GetRecommendedImages(int numResults = 9)
    {
        var images = await _context.Image
            .Include(image => image.Artwork)
                .ThenInclude(artwork => artwork!.Artist)
            .Where(image => image.Path != null && image.Embedding != null)
            .ToListAsync();

        if (images.Count == 0)
        {
            return null;
        }

        var randomNumber = new Random();
        var randomImage = images[randomNumber.Next(images.Count)];

        var chosenEmbedding = System.Text.Json.JsonSerializer
            .Deserialize<float[]>(randomImage.Embedding!);

        var similarImages = images
            .Where(image => image.Id != randomImage.Id)
            .Select(image =>
            {
                float[] currentEmbedding = System.Text.Json.JsonSerializer
                    .Deserialize<float[]>(image.Embedding!)!;

                return new
                {
                    Path = image.Path!,
                    Slug = image.Artwork!.Slug,
                    Title = image.Artwork!.Title,
                    Artist = image.Artwork?.Artist?.Name ?? null,
                    ArtistSlug = image.Artwork?.Artist?.Slug ?? null,
                    Score = CosineSimilarity(chosenEmbedding!, currentEmbedding)
                };
            })
            .OrderByDescending(image => image.Score)
            .Take(numResults)
            .Select(image => new PublicMetadataDto
            {
                Path = image.Path,
                Slug = image.Slug,
                Title = image.Title,
                Artist = image.Artist != null ? image.Artist : null,
                ArtistSlug = image.ArtistSlug != null ? image.ArtistSlug : null
            })
            .ToList();

        return new PublicImageRecommendationDto
        {
            RandomImage = new PublicMetadataDto
            {
                Path = randomImage.Path!,
                Slug = randomImage.Artwork!.Slug,
                Title = randomImage.Artwork!.Title,
                Artist = randomImage.Artwork?.Artist?.Name ?? null,
                ArtistSlug = randomImage.Artwork?.Artist?.Slug ?? null
            },
            Recommendations = similarImages
        };
    }

    public async Task<List<PublicMetadataDto>> GetRandomImages(PublicImageQueryDto query)
    {
        return await _context.Image
            .Include(image => image.Artwork)
                .ThenInclude(artwork => artwork!.Artist)
            .Where(image => image.Path != null)
            .OrderBy(image => EF.Functions.Random())
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(image => new PublicMetadataDto
            {
                Path = image.Path!,
                Title = image.Artwork!.Title,
                Slug = image.Artwork!.Slug,
                Artist = image.Artwork.Artist != null ? image.Artwork.Artist.Name : null,
                ArtistSlug = image.Artwork.Artist != null ? image.Artwork.Artist.Slug : null
            })
            .ToListAsync();
    }

    private float CosineSimilarity(float[] a, float[] b)
    {
        float dot = 0f;
        float normA = 0f;
        float normB = 0f;

        for (int i = 0; i < a.Length; i++)
        {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        return dot / ((float)Math.Sqrt(normA) * (float)Math.Sqrt(normB));
    }
}
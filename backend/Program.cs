using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Data;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

var publicFrontend = builder.Configuration["AppSettings:PublicFrontendURL"];
builder.Services.AddCors(options =>
{
    options.AddPolicy("dev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });

    options.AddPolicy("PublicGallery", policy =>
    {
        if (!string.IsNullOrEmpty(publicFrontend))
        {
            policy.WithOrigins(publicFrontend)
                .WithMethods("GET")
                .AllowAnyHeader();
        }
    });
});

// Configure JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["accessToken"];
            return Task.CompletedTask;
        }
    };

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// Configure CSRF Antiforgery
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
});

builder.Services.AddAuthorization();

// Create Database connection
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=database.db"));

// Register EmailService Configuration
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IArtworkService, ArtworkService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<ISpreadsheetService, SpreadsheetService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IPublicService, PublicService>();

builder.Services.AddHostedService<TokenCleanupService>();

// Configure Controllers
builder.Services.AddControllers();

WebApplication app = builder.Build();

// Seed default_admin account in Database.
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DatabaseSeed.Seed(context);
}

// Enable CORS policy
app.UseCors();

// Enable Authentication and Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Enable Controllers
app.MapControllers();

// Will be used eventually to serve built React frontend
// app.UseDefaultFiles();
app.UseStaticFiles();
// app.MapFallbackToFile("index.html");

app.Run();

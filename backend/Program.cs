using Microsoft.EntityFrameworkCore;
using backend.Data;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Create CORS policy to connect with React frontend (http://localhost:5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("dev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Create Database connection
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=database.db"));

// Configure Controllers
builder.Services.AddControllers();

WebApplication app = builder.Build();

// Enable CORS policy
app.UseCors("dev");

// Enable Controllers
app.MapControllers();

// Will be used eventually to serve built React frontend
// app.UseDefaultFiles();
app.UseStaticFiles();
// app.MapFallbackToFile("index.html");

app.Run();

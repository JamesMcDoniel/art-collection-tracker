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

WebApplication app = builder.Build();

// Enable CORS policy
app.UseCors("dev");

app.Run();

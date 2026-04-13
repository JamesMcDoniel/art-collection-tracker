using backend.Data;
using Microsoft.EntityFrameworkCore;

public class TokenCleanupService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public TokenCleanupService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await CleanupTokens();
            await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
        }
    }

    private async Task CleanupTokens()
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;

        var refreshCutoff = now.AddDays(-7);
        await context.RefreshToken
            .Where(refreshToken =>
                (refreshToken.RevokedAt != null && refreshToken.RevokedAt < refreshCutoff) ||
                refreshToken.ExpiresAt < now)
            .ExecuteDeleteAsync();

        var resetCutoff = now.AddDays(-1);
        await context.PasswordReset
            .Where(passwordReset => passwordReset.isUsed || passwordReset.ExpiresAt < now)
            .ExecuteDeleteAsync();
    }
}
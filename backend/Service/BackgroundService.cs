public class ClassStatusBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public ClassStatusBackgroundService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();

            var classService =
                scope.ServiceProvider.GetRequiredService<ClassService>();

            await classService.UpdateFinishedClasses();

            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }
}
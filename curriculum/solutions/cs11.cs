static async Task<bool> PingAsync(string host, CancellationToken ct)
{
    await Task.Delay(50, ct);
    return host.Length > 0;
}

static async Task<int> SweepAsync(IEnumerable<string> hosts, CancellationToken ct)
{
    var results = await Task.WhenAll(hosts.Select(h => PingAsync(h, ct)));
    return results.Count(ok => ok);
}

using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
Console.WriteLine(await SweepAsync(["north", "harbor", ""], cts.Token));

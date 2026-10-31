static Dictionary<string, int> Tally(List<string> ips)
{
    var counts = new Dictionary<string, int>();
    foreach (var ip in ips)
        counts[ip] = counts.GetValueOrDefault(ip) + 1;
    return counts;
}

var tally = Tally(["10.0.0.4", "10.0.0.4", "8.8.8.8"]);
if (tally.TryGetValue("10.0.0.4", out var hits))
    Console.WriteLine($"10.0.0.4 hit {hits} times");

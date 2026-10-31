static class Logs
{
    public static List<string> FailIps(IEnumerable<string> lines) =>
        lines.Where(l => l.EndsWith("FAIL"))
             .Select(l => l.Split(' ')[0])
             .ToList();

    public static Dictionary<string, int> ByIp(IEnumerable<string> lines) =>
        lines.Select(l => l.Split(' ')[0])
             .GroupBy(ip => ip)
             .ToDictionary(g => g.Key, g => g.Count());
}

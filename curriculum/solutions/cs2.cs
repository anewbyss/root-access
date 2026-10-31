static string ThreatLevel(int score) => score switch
{
    >= 90 => "CRITICAL",
    >= 60 => "HIGH",
    >= 30 => "MEDIUM",
    _ => "LOW",
};

foreach (var s in new[] { 95, 61, 12 })
    Console.WriteLine($"{s}: {ThreatLevel(s)}");

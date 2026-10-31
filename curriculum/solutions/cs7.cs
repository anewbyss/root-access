class BadPortException(string input) : Exception($"bad port: {input}")
{
    public string Input { get; } = input;
}

static class Ports
{
    public static int ParsePort(string s)
    {
        if (!int.TryParse(s, out var p) || p is < 1 or > 65535)
            throw new BadPortException(s);
        return p;
    }

    public static int Load(string path, string? fallback)
    {
        using var reader = new StreamReader(path);
        var raw = reader.ReadLine() ?? fallback ?? "443";
        try
        {
            return ParsePort(raw);
        }
        catch (BadPortException e) when (e.Input.Length > 0)
        {
            Console.Error.WriteLine(e.Message);
            return 443;
        }
        finally
        {
            Console.WriteLine("parse attempted");
        }
    }
}

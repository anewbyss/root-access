static string Scan(string host, int port = 443) => $"{host}:{port}";

static bool TryParsePort(string s, out int port) =>
    int.TryParse(s, out port) && port is >= 1 and <= 65535;

static (int Up, int Down) Count(bool[] results) =>
    (results.Count(r => r), results.Count(r => !r));

Console.WriteLine(Scan("relay.example", port: 8443));

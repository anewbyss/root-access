using System.Text;

const string Brief = """
    Operator,
    decode the "relay" before dawn.
    """;

static string Caesar(string text, int shift)
{
    var sb = new StringBuilder(text.Length);
    int s = ((shift % 26) + 26) % 26;
    foreach (char c in text)
    {
        if (char.IsLetter(c) && c < 128)
        {
            char b = char.IsUpper(c) ? 'A' : 'a';
            sb.Append((char)(b + (c - b + s) % 26));
        }
        else sb.Append(c);
    }
    return sb.ToString();
}

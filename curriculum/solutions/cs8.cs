interface IDetector
{
    bool Detect(string line);
}

abstract class Rule : IDetector
{
    public abstract bool Detect(string line);
    public virtual string Label => "rule";
}

sealed class Keyword(string word) : Rule
{
    public override bool Detect(string line) => line.Contains(word);
    public override string Label => $"keyword:{word}";
}

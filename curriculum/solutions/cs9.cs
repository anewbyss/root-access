class Box<T>(T value)
{
    public T Value { get; } = value;
}

static class Generics
{
    public static T Strongest<T>(IEnumerable<T> xs) where T : IComparable<T>
    {
        T best = default!;
        bool first = true;
        foreach (var x in xs)
        {
            if (first || x.CompareTo(best) > 0) { best = x; first = false; }
        }
        return best;
    }

    public static T Fresh<T>() where T : new() => new T();
}

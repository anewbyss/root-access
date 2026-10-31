record Node(string Name, int Strength = 0)
{
    public bool IsHot => Strength > 80;
}

class Session
{
    public int Requests { get; private set; }
    public required string Id { get; init; }
    public void Hit() => Requests++;
}

class Demo
{
    static void Run()
    {
        var a = new Node("north", 40);
        var b = a with { Strength = 90 };
        var s = new Session { Id = "s-1" };
        Console.WriteLine($"{b.IsHot} {s.Id}");
    }
}

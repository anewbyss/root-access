static string Intro(string handle, int level) => $"Agent {handle} // level {level}";

var handle = "neo";
Console.WriteLine(Intro(handle, 3));

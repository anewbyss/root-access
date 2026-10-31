// @cp Strongest of ints | Strongest of strings | Box<T> holds a value | a generic method uses a new() constraint
Ra.Try("Strongest of ints", () => Ra.Eq("Strongest of ints", (int)Ra.CallG("Strongest", new[] { typeof(int) }, new List<int> { 3, 9, 2 })!, 9));
Ra.Try("Strongest of strings", () => Ra.Eq("Strongest of strings", (string?)Ra.CallG("Strongest", new[] { typeof(string) }, new List<string> { "alpha", "omega", "beta" }), "omega"));
Ra.Try("Box<T> holds a value", () => { var b = Activator.CreateInstance(typeof(Box<int>), 7)!; var v = typeof(Box<int>).GetProperties().Select(p => p.GetValue(b)).FirstOrDefault(); Ra.Eq("Box<T> holds a value", v, (object)7); });
Ra.Cp(typeof(Ra).Assembly.GetTypes().SelectMany(t => t.GetMethods(System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic))
    .Where(m => m.IsGenericMethodDefinition).SelectMany(m => m.GetGenericArguments())
    .Any(g => (g.GenericParameterAttributes & System.Reflection.GenericParameterAttributes.DefaultConstructorConstraint) != 0), "a generic method uses a new() constraint");
//@@USER@@
//@@PRELUDE@@

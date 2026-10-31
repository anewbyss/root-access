// @cp Tally counts | Tally empty
Ra.Try("Tally counts", () => {
    var d = (Dictionary<string, int>)Ra.Call("Tally", new List<string> { "a", "b", "a" })!;
    Ra.Cp(d.Count == 2 && d["a"] == 2 && d["b"] == 1, "Tally counts", string.Join(",", d.Select(kv => $"{kv.Key}={kv.Value}")));
});
Ra.Try("Tally empty", () => Ra.Eq("Tally empty", ((Dictionary<string, int>)Ra.Call("Tally", new List<string>())!).Count, 0));
//@@USER@@
//@@PRELUDE@@

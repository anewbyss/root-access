// @cp PingAsync returns true for a host | SweepAsync counts reachable hosts | SweepAsync runs concurrently | cancellation is honoured
Ra.Try("PingAsync returns true for a host", () => Ra.Cp(((Task<bool>)Ra.Call("PingAsync", "north", CancellationToken.None)!).GetAwaiter().GetResult(), "PingAsync returns true for a host"));
Ra.Try("SweepAsync counts reachable hosts", () => Ra.Eq("SweepAsync counts reachable hosts", ((Task<int>)Ra.Call("SweepAsync", new List<string> { "a", "", "c" }, CancellationToken.None)!).GetAwaiter().GetResult(), 2));
Ra.Try("SweepAsync runs concurrently", () => {
    var sw = System.Diagnostics.Stopwatch.StartNew(); ((Task<bool>)Ra.Call("PingAsync", "x", CancellationToken.None)!).GetAwaiter().GetResult(); var one = sw.ElapsedMilliseconds;
    sw.Restart(); ((Task<int>)Ra.Call("SweepAsync", Enumerable.Range(0, 40).Select(i => $"h{i}").ToList(), CancellationToken.None)!).GetAwaiter().GetResult();
    Ra.Cp(sw.ElapsedMilliseconds < one * 10 + 500, "SweepAsync runs concurrently", $"40 hosts took {sw.ElapsedMilliseconds}ms, one ping {one}ms");
});
Ra.Try("cancellation is honoured", () => {
    using var __c = new CancellationTokenSource(); __c.Cancel();
    try { ((Task<bool>)Ra.Call("PingAsync", "x", __c.Token)!).GetAwaiter().GetResult(); Ra.Cp(false, "cancellation is honoured", "PingAsync ignored a cancelled token (pass ct to Task.Delay)"); }
    catch (OperationCanceledException) { Ra.Cp(true, "cancellation is honoured"); }
});
//@@USER@@
//@@PRELUDE@@

// @cp has [SerializeField] private fields | Start and Update run | event fires when a target is in range | Your [Fact] tests pass
var __t = typeof(Ra).Assembly.GetTypes().First(t => t.IsSubclassOf(typeof(UnityEngine.MonoBehaviour)));
const System.Reflection.BindingFlags __all = System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic;
Ra.Cp(__t.GetFields(__all).Any(f => f.IsPrivate && f.IsDefined(typeof(UnityEngine.SerializeField), false)), "has [SerializeField] private fields");
var __d = (UnityEngine.MonoBehaviour)Activator.CreateInstance(__t)!;
UnityEngine.Time.deltaTime = 0.016f;
Ra.Try("Start and Update run", () => { __t.GetMethod("Start", __all)?.Invoke(__d, null); __t.GetMethod("Update", __all)!.Invoke(__d, null); Ra.Cp(true, "Start and Update run"); });
Ra.Try("event fires when a target is in range", () => {
    var tf = __t.GetFields(__all).FirstOrDefault(f => f.FieldType == typeof(UnityEngine.Transform));
    tf?.SetValue(__d, new UnityEngine.Transform { position = new UnityEngine.Vector3(0.5f, 0, 0) });
    var ev = __t.GetEvents(__all).First(); bool fired = false;
    var h = ev.EventHandlerType!; var inv = h.GetMethod("Invoke")!;
    var ps = inv.GetParameters().Select(p => System.Linq.Expressions.Expression.Parameter(p.ParameterType)).ToArray();
    Action mark = () => fired = true;
    var del = System.Linq.Expressions.Expression.Lambda(h, System.Linq.Expressions.Expression.Invoke(System.Linq.Expressions.Expression.Constant(mark)), ps).Compile();
    ev.AddEventHandler(__d, del);
    for (int i = 0; i < 3; i++) __t.GetMethod("Update", __all)!.Invoke(__d, null);
    Ra.Cp(fired, "event fires when a target is in range", "set a Transform target 0.5 units away and called Update; event never fired");
});
int __n = 0, __f = 0;
foreach (var tt in typeof(Ra).Assembly.GetTypes())
    foreach (var m in tt.GetMethods().Where(m => m.IsDefined(typeof(Xunit.FactAttribute), false)))
    { __n++; try { m.Invoke(m.IsStatic ? null : Activator.CreateInstance(tt), null); } catch (Exception e) { __f++; Console.WriteLine($"test {m.Name} failed: {e.InnerException?.Message}"); } }
Ra.Cp(__n >= 1 && __f == 0, "Your [Fact] tests pass", $"{__f} of {__n} failed");
//@@USER@@
//@@PRELUDE@@

// @cp ParsePort ok | garbage throws BadPortException | out of range throws | BadPortException is an Exception
Ra.Try("ParsePort ok", () => Ra.Eq("ParsePort ok", (int)Ra.Call("ParsePort", "443")!, 443));
foreach (var (__in, __label) in new[] { ("http", "garbage throws BadPortException"), ("70000", "out of range throws") })
{
    try { Ra.Call("ParsePort", __in); Ra.Cp(false, __label, "no exception"); }
    catch (BadPortException) { Ra.Cp(true, __label); }
    catch (Exception e) { Ra.Cp(false, __label, $"threw {e.GetType().Name}"); }
}
Ra.Cp(typeof(Exception).IsAssignableFrom(typeof(BadPortException)), "BadPortException is an Exception");
//@@USER@@
//@@PRELUDE@@

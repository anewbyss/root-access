// @cp records compare by value | with makes a changed copy | IsHot above 80 | Session.Id is required init
Ra.Try("records compare by value", () => Ra.Eq("records compare by value", new Node("a", 1), new Node("a", 1)));
Ra.Try("with makes a changed copy", () => { var a = new Node("north", 40); var b = a with { Strength = 90 }; Ra.Cp(a.Strength == 40 && b.Strength == 90 && b.Name == "north", "with makes a changed copy", $"{a} -> {b}"); });
Ra.Try("IsHot above 80", () => Ra.Cp(new Node("x", 90).IsHot && !new Node("x", 10).IsHot, "IsHot above 80", ""));
Ra.Try("Session.Id is required init", () => {
    var p = typeof(Session).GetProperty("Id")!;
    bool init = p.SetMethod?.ReturnParameter.GetRequiredCustomModifiers().Any(t => t.Name == "IsExternalInit") ?? false;
    bool req = p.CustomAttributes.Any(a => a.AttributeType.Name == "RequiredMemberAttribute");
    Ra.Cp(init && req, "Session.Id is required init", $"init={init} required={req}");
});
//@@USER@@
//@@PRELUDE@@

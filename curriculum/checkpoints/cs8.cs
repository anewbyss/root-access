// @cp Keyword detects substrings | Keyword is a sealed Rule | Rule is abstract and an IDetector | Rule has a virtual member
Ra.Try("Keyword detects substrings", () => { var k = (IDetector)Activator.CreateInstance(typeof(Keyword), "jndi")!; Ra.Cp(k.Detect("${jndi:x}") && !k.Detect("hello"), "Keyword detects substrings"); });
Ra.Cp(typeof(Keyword).IsSealed && typeof(Rule).IsAssignableFrom(typeof(Keyword)), "Keyword is a sealed Rule");
Ra.Cp(typeof(Rule).IsAbstract && typeof(IDetector).IsAssignableFrom(typeof(Rule)), "Rule is abstract and an IDetector");
Ra.Cp(typeof(Rule).GetMethods().Any(m => m.DeclaringType == typeof(Rule) && m.IsVirtual && !m.IsAbstract && !m.IsFinal), "Rule has a virtual member");
//@@USER@@
//@@PRELUDE@@

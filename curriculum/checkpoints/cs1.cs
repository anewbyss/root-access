// @cp Intro("neo", 3) | Intro("trinity", 12)
Ra.Try("Intro(\"neo\", 3)", () => Ra.Eq("Intro(\"neo\", 3)", (string?)Ra.Call("Intro", "neo", 3), "Agent neo // level 3"));
Ra.Try("Intro(\"trinity\", 12)", () => Ra.Eq("Intro(\"trinity\", 12)", (string?)Ra.Call("Intro", "trinity", 12), "Agent trinity // level 12"));
//@@USER@@
//@@PRELUDE@@

// @cp boost mutates the struct | isHot is computed | structs copy by value | Session keeps its id
//@@USER@@
//@@PRELUDE@@
var raN = Node(name: "north", strength: 50)
raN.boost(10)
raEq("boost mutates the struct", raN.strength, 60)
var raHot = Node(name: "core", strength: 100)
var raCold = Node(name: "cold", strength: 0)
raCp(raHot.isHot && !raCold.isHot, "isHot is computed")
var raCopy = raN
raCopy.boost(5)
raCp(raN.strength == 60 && raCopy.strength == 65, "structs copy by value")
raEq("Session keeps its id", Session(id: "s-1").id, "s-1")

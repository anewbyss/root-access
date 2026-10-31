func intro(handle: String, level: Int) -> String {
    "Agent \(handle) // level \(level)"
}

let agent = "neo"
var runs = 0
runs += 1
print(intro(handle: agent, level: 3), runs)

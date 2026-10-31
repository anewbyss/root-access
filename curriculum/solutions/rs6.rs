#[derive(Debug)]
struct Node {
    name: String,
    strength: u32,
}

impl Node {
    fn new(name: &str) -> Self {
        Self { name: name.to_string(), strength: 0 }
    }
    fn boost(&mut self, by: u32) -> u32 {
        self.strength += by;
        self.strength
    }
}

enum Event {
    Login(String),
    Breach(u8),
    Logout,
}

fn describe(e: &Event) -> String {
    match e {
        Event::Login(user) => format!("login {user}"),
        Event::Breach(sev) => format!("breach {sev}"),
        Event::Logout => "logout".to_string(),
    }
}

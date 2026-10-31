use std::sync::{Arc, Mutex};
use std::thread;

fn sweep(hosts: Vec<String>) -> usize {
    let counter = Arc::new(Mutex::new(0usize));
    let mut handles = vec![];
    for host in hosts {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            if !host.is_empty() {
                *c.lock().unwrap() += 1;
            }
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
    let total = *counter.lock().unwrap();
    total
}

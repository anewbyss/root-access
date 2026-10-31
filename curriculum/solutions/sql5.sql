SELECT a.name, e.ip, e.ts FROM events e JOIN agents a ON a.id = e.agent_id WHERE e.status='failed' ORDER BY e.id;

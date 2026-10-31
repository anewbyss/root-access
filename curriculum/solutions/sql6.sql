SELECT a.name FROM agents a LEFT JOIN events e ON e.agent_id = a.id WHERE e.id IS NULL ORDER BY a.name;

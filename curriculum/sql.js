RA.lang("sql", { name: "SQL", tag: "SQL", runtime: "sql", why: "How every company talks to its data. Checkpoints run it against a real SQLite database." });
const SCHEMA = `<p class="mut">Training DB: <code>agents(id, name, faction, rank)</code>, <code>events(id, agent_id, ip, status, ts)</code>, <code>nodes(id, district, online)</code>.</p>`;
RA.add("sql", "sql", [
{ title: "Query the Archive", concept: "SELECT, columns, aliases",
  lesson: `${SCHEMA}<pre>SELECT name, rank FROM agents;
SELECT name AS handle, rank * 10 AS score FROM agents;
SELECT * FROM nodes;      -- every column (avoid in production)</pre><p>SQL is <b>declarative</b>: you describe the result you want and the database works out how to get it.</p>`,
  task: `Select the <code>name</code> and <code>faction</code> of every agent, with <code>name</code> aliased as <code>handle</code>.`,
  starter: `-- your query here\n`,
  checks: [[/select/i, "SELECT ..."], [/\bas\s+handle/i, "name AS handle"]],
  test: { sql: { solution: `SELECT name AS handle, faction FROM agents;` } } },

{ title: "Filter the Feed", concept: "WHERE, AND/OR, IN, LIKE, BETWEEN",
  lesson: `${SCHEMA}<pre>SELECT * FROM agents WHERE rank &gt;= 3 AND faction = 'sentinel';
SELECT * FROM agents WHERE faction IN ('logos', 'meridian');
SELECT * FROM events WHERE ip LIKE '10.0.%';
SELECT * FROM agents WHERE rank BETWEEN 2 AND 4;</pre><p>Strings use single quotes. <code>%</code> in LIKE matches any run of characters.</p>`,
  task: `Select <code>name</code> and <code>rank</code> of agents in faction <code>'sentinel'</code> or <code>'logos'</code> with rank of 3 or more. Order by <code>name</code>.`,
  starter: `-- your query here\n`,
  checks: [[/where/i, "WHERE ..."], [/\bin\s*\(|\bor\b/i, "IN (...) or OR"], [/order\s+by\s+name/i, "ORDER BY name"]],
  test: { sql: { solution: `SELECT name, rank FROM agents WHERE faction IN ('sentinel','logos') AND rank >= 3 ORDER BY name;` } } },

{ title: "Sort the Signal", concept: "ORDER BY, LIMIT/OFFSET, DISTINCT",
  lesson: `${SCHEMA}<pre>SELECT DISTINCT ip FROM events;
SELECT * FROM events ORDER BY ts DESC LIMIT 5;
SELECT * FROM events ORDER BY ts DESC LIMIT 5 OFFSET 5;  -- page 2</pre>`,
  task: `List each distinct <code>ip</code> that had a <code>'failed'</code> event, sorted ascending, limited to 3 rows.`,
  starter: `-- your query here\n`,
  checks: [[/distinct/i, "SELECT DISTINCT"], [/limit\s+3/i, "LIMIT 3"]],
  test: { sql: { solution: `SELECT DISTINCT ip FROM events WHERE status = 'failed' ORDER BY ip LIMIT 3;` } } },

{ title: "Brute Force Detector", concept: "COUNT/SUM/AVG, GROUP BY, HAVING",
  lesson: `${SCHEMA}<pre>SELECT faction, COUNT(*) AS n, AVG(rank) AS avg_rank
FROM agents
GROUP BY faction
HAVING COUNT(*) &gt; 2;</pre><p><code>WHERE</code> filters rows before grouping and <code>HAVING</code> filters groups afterward.</p>`,
  task: `Like Colonial Pipeline's attackers, someone is hammering logins. For <code>'failed'</code> events, return <code>ip</code> and <code>COUNT(*) AS fails</code> for IPs with 2 or more fails. Order by fails descending, then ip.`,
  starter: `-- your query here\n`,
  checks: [[/group\s+by\s+ip/i, "GROUP BY ip"], [/having/i, "HAVING COUNT(*) >= 2"]],
  test: { sql: { solution: `SELECT ip, COUNT(*) AS fails FROM events WHERE status='failed' GROUP BY ip HAVING COUNT(*) >= 2 ORDER BY fails DESC, ip;` } } },

{ title: "Connect the Dots", concept: "INNER JOIN, table aliases",
  lesson: `${SCHEMA}<pre>SELECT a.name, e.ip, e.ts
FROM events AS e
JOIN agents AS a ON a.id = e.agent_id
WHERE e.status = 'failed';</pre><p>An inner join keeps only rows that match on both sides.</p>`,
  task: `Return <code>a.name</code>, <code>e.ip</code> and <code>e.ts</code> for every failed event, joined to the agent, ordered by <code>e.id</code>.`,
  starter: `-- your query here\n`,
  checks: [[/join/i, "JOIN agents ..."], [/\bon\b/i, "ON a.id = e.agent_id"]],
  test: { sql: { solution: `SELECT a.name, e.ip, e.ts FROM events e JOIN agents a ON a.id = e.agent_id WHERE e.status='failed' ORDER BY e.id;` } } },

{ title: "The Silent Ones", concept: "LEFT JOIN, NULL, IS NULL, COALESCE",
  lesson: `${SCHEMA}<pre>SELECT a.name, COUNT(e.id) AS events
FROM agents a
LEFT JOIN events e ON e.agent_id = a.id
GROUP BY a.id;

SELECT COALESCE(nickname, name) FROM agents;  -- first non-null</pre><p>A left join keeps every row from the left side and fills in <code>NULL</code> where there's no match. Use <code>IS NULL</code>, never <code>= NULL</code>.</p>`,
  task: `Find agents with no events at all. Return <code>name</code>, ordered by name.`,
  starter: `-- your query here\n`,
  checks: [[/left\s+join/i, "LEFT JOIN"], [/is\s+null/i, "WHERE ... IS NULL"]],
  test: { sql: { solution: `SELECT a.name FROM agents a LEFT JOIN events e ON e.agent_id = a.id WHERE e.id IS NULL ORDER BY a.name;` } } },

{ title: "Nested Intel", concept: "subqueries, CTEs (WITH)",
  lesson: `${SCHEMA}<pre>WITH fails AS (
  SELECT agent_id, COUNT(*) AS c
  FROM events WHERE status = 'failed'
  GROUP BY agent_id
)
SELECT a.name, f.c
FROM fails f JOIN agents a ON a.id = f.agent_id
WHERE f.c = (SELECT MAX(c) FROM fails);</pre><p>A CTE names an intermediate result so complex queries stay readable.</p>`,
  task: `Using a CTE, return the <code>name</code> and fail count (<code>c</code>) of the agent or agents with the most failed events. Order by name.`,
  starter: `-- your query here\n`,
  checks: [[/\bwith\b\s+\w+\s+as\s*\(/i, "WITH name AS (...)"], [/max\s*\(/i, "MAX(...) subquery"]],
  test: { sql: { solution: `WITH f AS (SELECT agent_id, COUNT(*) c FROM events WHERE status='failed' GROUP BY agent_id) SELECT a.name, f.c FROM f JOIN agents a ON a.id=f.agent_id WHERE f.c=(SELECT MAX(c) FROM f) ORDER BY a.name;` } } },

{ title: "Build the Safe House", concept: "CREATE TABLE, types, constraints, foreign keys",
  lesson: `<pre>CREATE TABLE medics (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  node_id INTEGER REFERENCES nodes(id),
  shifts INTEGER NOT NULL DEFAULT 0 CHECK (shifts &gt;= 0)
);</pre><p>Constraints are rules the database enforces for you. That's cheaper than finding bad data later.</p>`,
  task: `Create table <code>safehouses</code> with <code>id INTEGER PRIMARY KEY</code>, <code>district TEXT NOT NULL</code>, <code>capacity INTEGER NOT NULL CHECK (capacity &gt; 0)</code> and <code>node_id INTEGER REFERENCES nodes(id)</code>.`,
  starter: `-- your statement here\n`,
  checks: [[/create\s+table\s+safehouses/i, "CREATE TABLE safehouses"], [/check\s*\(\s*capacity\s*>\s*0\s*\)/i, "CHECK (capacity > 0)"], [/references\s+nodes/i, "REFERENCES nodes(id)"]],
  test: { sql: { solution: `CREATE TABLE safehouses (id INTEGER PRIMARY KEY, district TEXT NOT NULL, capacity INTEGER NOT NULL CHECK (capacity > 0), node_id INTEGER REFERENCES nodes(id));`,
    verify: `SELECT name, type, "notnull", pk FROM pragma_table_info('safehouses') ORDER BY cid;` } } },

{ title: "Atomic Strike", concept: "INSERT, UPDATE, DELETE, transactions",
  lesson: `<pre>BEGIN;
UPDATE nodes SET online = 0 WHERE district = 'harbor';
INSERT INTO nodes (district, online) VALUES ('tunnel', 1);
DELETE FROM events WHERE ts &lt; '2026-01-01';
COMMIT;      -- or ROLLBACK to undo everything</pre><p>A transaction is all or nothing. Always use a <code>WHERE</code> on UPDATE and DELETE unless you really mean every row.</p>`,
  task: `In one transaction: set <code>online = 0</code> for every <code>'old quarter'</code> node, insert a node <code>('tunnel', 1)</code>, and delete nodes in <code>'harbor'</code> that are offline. Then <code>COMMIT</code>.`,
  starter: `-- your statements here\n`,
  checks: [[/begin/i, "BEGIN;"], [/update\s+nodes/i, "UPDATE nodes ..."], [/insert\s+into\s+nodes/i, "INSERT INTO nodes ..."], [/delete\s+from\s+nodes/i, "DELETE FROM nodes ..."], [/commit/i, "COMMIT;"]],
  test: { sql: { solution: `BEGIN; UPDATE nodes SET online=0 WHERE district='old quarter'; INSERT INTO nodes (district, online) VALUES ('tunnel',1); DELETE FROM nodes WHERE district='harbor' AND online=0; COMMIT;`,
    verify: `SELECT district, online FROM nodes ORDER BY id;` } } },

{ title: "Speed of Light", concept: "indexes, EXPLAIN QUERY PLAN, parameterized queries",
  lesson: `<pre>CREATE INDEX idx_events_ip_status ON events(ip, status);
EXPLAIN QUERY PLAN SELECT * FROM events WHERE ip = '10.0.0.9';</pre><p>An index trades write speed and disk space for fast lookups. Column order matters.</p><p><b>Security:</b> MOVEit (2023) was a SQL injection. Never build SQL by gluing strings together. Always use placeholders from your app: <code>WHERE ip = ?</code>.</p>`,
  task: `Create an index named <code>idx_events_ip_status</code> on <code>events(ip, status)</code>, and a unique index <code>idx_agents_name</code> on <code>agents(name)</code>.`,
  starter: `-- your statements here\n`,
  checks: [[/create\s+index\s+idx_events_ip_status\s+on\s+events\s*\(\s*ip\s*,\s*status\s*\)/i, "CREATE INDEX idx_events_ip_status ON events(ip, status)"], [/create\s+unique\s+index\s+idx_agents_name/i, "CREATE UNIQUE INDEX idx_agents_name ON agents(name)"]],
  test: { sql: { solution: `CREATE INDEX idx_events_ip_status ON events(ip, status); CREATE UNIQUE INDEX idx_agents_name ON agents(name);`,
    verify: `SELECT name, tbl_name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%' ORDER BY name;` } } },

{ title: "Ranked Order", concept: "window functions: RANK, ROW_NUMBER, running totals",
  lesson: `${SCHEMA}<pre>SELECT name, faction, rank,
  RANK() OVER (PARTITION BY faction ORDER BY rank DESC) AS r,
  SUM(rank) OVER (ORDER BY id) AS running
FROM agents;</pre><p>Window functions compute across related rows without collapsing them the way GROUP BY does.</p>`,
  task: `Return <code>name</code>, <code>faction</code> and <code>RANK() OVER (PARTITION BY faction ORDER BY rank DESC) AS r</code>. Keep only each faction's top-ranked agent (r = 1, so use a subquery or CTE), ordered by faction.`,
  starter: `-- your query here\n`,
  checks: [[/over\s*\(\s*partition\s+by\s+faction/i, "OVER (PARTITION BY faction ...)"], [/rank\s*\(\s*\)/i, "RANK()"]],
  test: { sql: { solution: `SELECT name, faction, r FROM (SELECT name, faction, RANK() OVER (PARTITION BY faction ORDER BY rank DESC) AS r FROM agents) WHERE r = 1 ORDER BY faction;` } } },

{ title: "Operation: Threat Board", concept: "capstone: views, joins, aggregates, windows",
  lesson: `${SCHEMA}<p>A <b>view</b> is a saved query that behaves like a table. Ops teams build dashboards on top of them.</p><pre>CREATE VIEW v AS SELECT ...;</pre>`,
  task: `Create a view <code>threat_board</code> with one row per IP that has failed events: <code>ip</code>, <code>fails</code> (count), <code>agents</code> (count of distinct agent names involved, using a JOIN) and <code>last_seen</code> (MAX ts). Then <code>SELECT * FROM threat_board ORDER BY fails DESC, ip;</code>`,
  starter: `-- your statements here\n`,
  checks: [[/create\s+view\s+threat_board/i, "CREATE VIEW threat_board AS ..."], [/count\s*\(\s*distinct/i, "COUNT(DISTINCT ...)"], [/join/i, "JOIN agents"], [/max\s*\(\s*\w*\.?ts\s*\)/i, "MAX(ts) AS last_seen"]],
  test: { sql: { solution: `CREATE VIEW threat_board AS SELECT e.ip, COUNT(*) AS fails, COUNT(DISTINCT a.name) AS agents, MAX(e.ts) AS last_seen FROM events e JOIN agents a ON a.id=e.agent_id WHERE e.status='failed' GROUP BY e.ip; SELECT * FROM threat_board ORDER BY fails DESC, ip;` } } }
]);

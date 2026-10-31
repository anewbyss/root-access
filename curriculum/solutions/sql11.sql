SELECT name, faction, r FROM (SELECT name, faction, RANK() OVER (PARTITION BY faction ORDER BY rank DESC) AS r FROM agents) WHERE r = 1 ORDER BY faction;

BEGIN; UPDATE nodes SET online=0 WHERE district='old quarter'; INSERT INTO nodes (district, online) VALUES ('tunnel',1); DELETE FROM nodes WHERE district='harbor' AND online=0; COMMIT;

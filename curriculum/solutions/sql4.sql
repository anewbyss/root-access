SELECT ip, COUNT(*) AS fails FROM events WHERE status='failed' GROUP BY ip HAVING COUNT(*) >= 2 ORDER BY fails DESC, ip;

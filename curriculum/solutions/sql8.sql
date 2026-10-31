CREATE TABLE safehouses (id INTEGER PRIMARY KEY, district TEXT NOT NULL, capacity INTEGER NOT NULL CHECK (capacity > 0), node_id INTEGER REFERENCES nodes(id));

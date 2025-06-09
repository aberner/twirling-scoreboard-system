const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./scoreboard.db');

// Create tables if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scores TEXT NOT NULL,
      penalties INTEGER NOT NULL,
      status TEXT NOT NULL,
      enteredBy TEXT,
      updatedAt TEXT,
      createdAt TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS live_score (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      scoreId INTEGER,
      manualMode INTEGER
    )
  `);

  // Ensure there is always a live_score row
  db.get(`SELECT * FROM live_score WHERE id = 1`, (err, row) => {
    if (!row) {
      db.run(`INSERT INTO live_score (id, scoreId, manualMode) VALUES (1, NULL, 0)`);
    }
  });
});

module.exports = db;

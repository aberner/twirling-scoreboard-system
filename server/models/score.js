const db = require('../db');

exports.getAll = () =>
  new Promise((resolve, reject) => {
    db.all(`SELECT * FROM scores ORDER BY createdAt DESC`, [], (err, rows) =>
      err ? reject(err) : resolve(rows.map(row => ({
        ...row,
        scores: JSON.parse(row.scores)
      })))
    );
  });

exports.getByUser = (enteredBy) =>
  new Promise((resolve, reject) => {
    db.all(`SELECT * FROM scores WHERE enteredBy = ? ORDER BY createdAt DESC`, [enteredBy], (err, rows) =>
      err ? reject(err) : resolve(rows.map(row => ({
        ...row,
        scores: JSON.parse(row.scores)
      })))
    );
  });

exports.create = ({ scores, penalties, status, enteredBy }) =>
  new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.run(
      `INSERT INTO scores (scores, penalties, status, enteredBy, updatedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
      [JSON.stringify(scores), penalties, status, enteredBy, now, now],
      function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          scores,
          penalties,
          status,
          enteredBy,
          updatedAt: now,
          createdAt: now,
        });
      }
    );
  });

exports.update = (id, { scores, penalties, status }) =>
  new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.run(
      `UPDATE scores SET scores = ?, penalties = ?, status = ?, updatedAt = ? WHERE id = ?`,
      [JSON.stringify(scores), penalties, status, now, id],
      function (err) {
        if (err) return reject(err);
        db.get(`SELECT * FROM scores WHERE id = ?`, [id], (err, row) =>
          err ? reject(err) : resolve({ ...row, scores: JSON.parse(row.scores) })
        );
      }
    );
  });

exports.setStatus = (id, status) =>
  new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.run(
      `UPDATE scores SET status = ?, updatedAt = ? WHERE id = ?`,
      [status, now, id],
      function (err) {
        if (err) return reject(err);
        db.get(`SELECT * FROM scores WHERE id = ?`, [id], (err, row) =>
          err ? reject(err) : resolve({ ...row, scores: JSON.parse(row.scores) })
        );
      }
    );
  });

exports.findById = (id) =>
  new Promise((resolve, reject) => {
    db.get(`SELECT * FROM scores WHERE id = ?`, [id], (err, row) =>
      err ? reject(err) : resolve(row ? { ...row, scores: JSON.parse(row.scores) } : null)
    );
  });

exports.latestApproved = () =>
  new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM scores WHERE status = 'Approved' ORDER BY updatedAt DESC LIMIT 1`,
      [],
      (err, row) => err ? reject(err) : resolve(row ? { ...row, scores: JSON.parse(row.scores) } : null)
    );
  });

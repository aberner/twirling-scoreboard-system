const express = require('express');
const router = express.Router();
const scoreModel = require('../models/score');
const db = require('../db');

// Helper: mock enteredBy from query/user for demo
function getEnteredBy(req) {
  // In production, use real authentication!
  return req.query.user || "support1";
}

// All scores (admin)
router.get('/all', async (req, res) => {
  const scores = await scoreModel.getAll();
  res.json(scores);
});

// Scores entered by current support user
router.get('/my-entries', async (req, res) => {
  const scores = await scoreModel.getByUser(getEnteredBy(req));
  res.json(scores);
});

// Submit new score
router.post('/', async (req, res) => {
  const { scores, penalties } = req.body;
  const newScore = await scoreModel.create({
    scores,
    penalties,
    status: 'Pending',
    enteredBy: getEnteredBy(req),
  });
  res.json(newScore);
});

// Edit an existing (rejected) score
router.put('/:id', async (req, res) => {
  const { scores, penalties } = req.body;
  const score = await scoreModel.findById(req.params.id);
  if (score.status !== 'Rejected') return res.status(400).json({ error: "Only rejected scores can be edited." });
  const updated = await scoreModel.update(req.params.id, { scores, penalties, status: 'Pending' });
  res.json(updated);
});

// Change status (admin)
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const updated = await scoreModel.setStatus(req.params.id, status);
  res.json(updated);
});

// LIVE SCORE endpoints

// Get current live score (and manual mode)
router.get('/../live-score', (req, res) => {
  db.get(`SELECT * FROM live_score WHERE id = 1`, async (err, row) => {
    if (row && row.scoreId) {
      const score = await scoreModel.findById(row.scoreId);
      res.json({ id: row.scoreId, manualMode: !!row.manualMode, score });
    } else if (!row.manualMode) {
      const latest = await scoreModel.latestApproved();
      res.json({ id: latest?.id, manualMode: false, score: latest });
    } else {
      res.json({ id: null, manualMode: !!row.manualMode, score: null });
    }
  });
});

// Set live score or mode (admin)
router.put('/../live-score', (req, res) => {
  const { id, manualMode } = req.body;
  db.run(
    `UPDATE live_score SET scoreId = ?, manualMode = ? WHERE id = 1`,
    [manualMode ? id : null, manualMode ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

module.exports = router;

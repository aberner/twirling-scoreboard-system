import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [scores, setScores] = useState([]);
  const [liveScoreId, setLiveScoreId] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [scoresRes, liveRes] = await Promise.all([
        fetch("/api/scores/all"),
        fetch("/api/live-score"),
      ]);
      const scoresData = await scoresRes.json();
      const liveData = await liveRes.json();
      setScores(scoresData);
      setLiveScoreId(liveData.id);
      setManualMode(liveData.manualMode);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    const res = await fetch(`/api/scores/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setScores(scores =>
      scores.map(s => (s.id === id ? updated : s))
    );
  };

  const handleSetLiveScore = async (id) => {
    await fetch("/api/live-score", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, manualMode: true }),
    });
    setLiveScoreId(id);
    setManualMode(true);
  };

  const handleAutoMode = async () => {
    await fetch("/api/live-score", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manualMode: false }),
    });
    const latestApproved = scores
      .filter(s => s.status === "Approved")
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    setLiveScoreId(latestApproved?.id ?? null);
    setManualMode(false);
  };

  if (loading) return <div>Loading...</div>;
  const liveScore = scores.find(s => s.id === liveScoreId);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Admin Dashboard</h1>
      <div style={{
        marginBottom: 24,
        padding: 16,
        border: "2px solid #1976d2",
        borderRadius: 8,
        background: "#e3f2fd"
      }}>
        <label style={{ fontWeight: "bold" }}>
          <input
            type="checkbox"
            checked={manualMode}
            onChange={e => {
              if (e.target.checked) setManualMode(true);
              else handleAutoMode();
            }}
            style={{ marginRight: 8 }}
          />
          Manual Mode
        </label>
        <span style={{ marginLeft: 12, color: "#555" }}>
          {manualMode
            ? "Select any score to be shown live (overrides auto)."
            : "Latest approved score is shown live automatically."}
        </span>
      </div>
      <h2>Live Score Displayed</h2>
      {liveScore ? (
        <div style={{
          border: "2px solid green",
          background: "#e8f5e9",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24
        }}>
          <div>
            <b>ID:</b> {liveScore.id}
          </div>
          <div>
            <b>Judges' Scores:</b> {liveScore.scores.join(", ")}
          </div>
          <div>
            <b>Penalties:</b> {liveScore.penalties}
          </div>
          <div>
            <b>Status:</b> {liveScore.status}
          </div>
        </div>
      ) : (
        <div style={{ color: "red", marginBottom: 24 }}>
          No live score selected.
        </div>
      )}
      <h2>All Scores</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1976d2", color: "#fff" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Scores</th>
              <th style={thStyle}>Penalties</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Entered By</th>
              <th style={thStyle}>Last Updated</th>
              <th style={thStyle}>Set Live</th>
              <th style={thStyle}>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(s => (
              <tr key={s.id} style={{
                background: s.id === liveScoreId ? "#c8e6c9" : "#fff"
              }}>
                <td style={tdStyle}>{s.id}</td>
                <td style={tdStyle}>{s.scores.join(", ")}</td>
                <td style={tdStyle}>{s.penalties}</td>
                <td style={tdStyle}>{s.status}</td>
                <td style={tdStyle}>{s.enteredBy}</td>
                <td style={tdStyle}>{(new Date(s.updatedAt)).toLocaleString()}</td>
                <td style={tdStyle}>
                  <button
                    disabled={!manualMode || s.status !== "Approved"}
                    style={{
                      background: s.id === liveScoreId ? "#388e3c" : "#1976d2",
                      color: "#fff",
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: 4,
                      cursor: manualMode && s.status === "Approved" ? "pointer" : "not-allowed"
                    }}
                    onClick={() => handleSetLiveScore(s.id)}
                  >
                    {s.id === liveScoreId ? "LIVE" : "Show Live"}
                  </button>
                </td>
                <td style={tdStyle}>
                  <select
                    value={s.status}
                    onChange={e => handleStatusChange(s.id, e.target.value)}
                    style={{ padding: 4, borderRadius: 4 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const thStyle = {
  padding: "8px 12px",
  border: "1px solid #bbb",
  fontWeight: "bold"
};
const tdStyle = {
  padding: "6px 10px",
  border: "1px solid #bbb",
  textAlign: "center"
};

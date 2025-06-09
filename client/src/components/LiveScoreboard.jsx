import React, { useEffect, useState } from "react";

export default function LiveScoreboard() {
  const [live, setLive] = useState(null);

  useEffect(() => {
    let timer;
    function fetchLive() {
      fetch("/api/live-score")
        .then(res => res.json())
        .then(data => setLive(data.score));
    }
    fetchLive();
    timer = setInterval(fetchLive, 3000); // auto-refresh every 3 seconds
    return () => clearInterval(timer);
  }, []);

  if (!live) return <div style={{ fontSize: 32, textAlign: "center", padding: 40 }}>Waiting for live score...</div>;

  return (
    <div style={{
      background: "#222",
      color: "#fff",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h1 style={{ fontSize: 72, margin: 0 }}>LIVE SCORE</h1>
      <div style={{
        fontSize: 48,
        margin: "24px 0",
        background: "#1976d2",
        padding: "32px 48px",
        borderRadius: 24
      }}>
        <div>Judges: {live.scores.join(" - ")}</div>
        <div>Penalties: {live.penalties}</div>
      </div>
      <div style={{ fontSize: 24, marginTop: 32 }}>
        Last updated: {(new Date(live.updatedAt)).toLocaleTimeString()}
      </div>
    </div>
  );
}

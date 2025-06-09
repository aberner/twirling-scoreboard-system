import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ScoreEntryPage from "./components/ScoreEntryPage";
import AdminDashboard from "./components/AdminDashboard";
import LiveScoreboard from "./components/LiveScoreboard";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "10px", background: "#efefef" }}>
        <Link to="/score-entry" style={{ marginRight: 10 }}>Score Entry</Link>
        <Link to="/admin" style={{ marginRight: 10 }}>Admin Dashboard</Link>
        <Link to="/live">Live Scoreboard</Link>
      </nav>
      <Routes>
        <Route path="/score-entry" element={<ScoreEntryPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/live" element={<LiveScoreboard />} />
        <Route path="*" element={<div>Welcome to Scoreboard System</div>} />
      </Routes>
    </BrowserRouter>
  );
}

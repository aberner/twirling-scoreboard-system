import React, { useEffect, useState } from "react";

export default function ScoreEntryPage() {
  const [entries, setEntries] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetch("/api/scores/my-entries?user=support1")
      .then(res => res.json())
      .then(setEntries);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const scores = [
      Number(form.judge1.value),
      Number(form.judge2.value),
      Number(form.judge3.value),
      Number(form.judge4.value)
    ];
    const penalties = Number(form.penalties.value);

    if (editing) {
      fetch(`/api/scores/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores, penalties }),
      })
        .then(res => res.json())
        .then(updated => {
          setEntries(entries.map(e => e.id === updated.id ? updated : e));
          setEditing(null);
        });
    } else {
      fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores, penalties }),
      })
        .then(res => res.json())
        .then(newEntry => setEntries([newEntry, ...entries]));
    }

    form.reset();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Score Entry</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div>
          {["judge1", "judge2", "judge3", "judge4"].map((name, idx) => (
            <input
              key={name}
              name={name}
              type="number"
              min="0"
              max="10"
              required
              placeholder={`Judge ${idx + 1}`}
              style={{ width: 80, marginRight: 12, fontSize: 18 }}
              defaultValue={editing?.scores[idx] ?? ""}
            />
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            name="penalties"
            type="number"
            min="0"
            required
            placeholder="Penalties"
            style={{ width: 120, fontSize: 18, marginRight: 12 }}
            defaultValue={editing?.penalties ?? ""}
          />
          <button type="submit" style={{ fontSize: 18 }}>
            {editing ? "Update Score" : "Submit Score"}
          </button>
          {editing && <button type="button" onClick={() => setEditing(null)} style={{marginLeft: 10}}>Cancel</button>}
        </div>
      </form>
      <h3>Submitted Scores</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Scores</th>
            <th>Penalties</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.scores.join(", ")}</td>
              <td>{entry.penalties}</td>
              <td>{entry.status}</td>
              <td>{(new Date(entry.updatedAt)).toLocaleString()}</td>
              <td>
                {entry.status === "Rejected" && (
                  <button onClick={() => setEditing(entry)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

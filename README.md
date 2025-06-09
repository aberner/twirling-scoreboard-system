# twirling-scoreboard-system
A simple scoreboard system for twirling freestyle competions.

Everything written and served by Copilot..
This shouldn't compile and work...

A full stack system for event scoring with:

- Score Entry (touch/iPad)
- Admin Dashboard (laptop)
- Live Scoreboard (TV/webpage)

## Structure

- `/server` — Express backend with SQLite DB
- `/client` — React frontend

## Quick Start

### Backend

```
cd server
npm install
node app.js
```

### Frontend

```
cd client
npm install
npm start
```

## API Endpoints

- `POST /api/scores` — Submit score
- `GET /api/scores/my-entries?user=support1` — List support's scores
- `PUT /api/scores/:id` — Edit rejected score
- `GET /api/scores/all` — List all (admin)
- `PUT /api/scores/:id/status` — Change status (admin)
- `GET /api/live-score` — Live score & mode
- `PUT /api/live-score` — Set live/mode (admin)

## Setup Notes

- For demo, user auth is mocked (query param). Add real auth for production!
- SQLite file: `server/scoreboard.db`

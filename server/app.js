const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/scores', require('./routes/scores'));

// Serve client in production (optional)
// const path = require('path');
// app.use(express.static(path.join(__dirname, '../client/build')));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

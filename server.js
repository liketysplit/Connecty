const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('hello'));

// The actual port for the app in prodcution will come from the env. var. "PORT". For local dev., we just use 5000.
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
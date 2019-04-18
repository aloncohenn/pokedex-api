const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('tiny'));

app.use((req, res) => {
  res.send('Hello Pokemon!');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}...`);
});
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const app = express();
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));

app.use(
  (validateBearerToken = (req, res, next) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }
    next();
  })
);

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychich`,
  `Rock`,
  `Steel`,
  `Water`
];

const handleGetTypes = (req, res) => {
  res.json(validTypes);
};

app.get('/types', handleGetTypes);

const handleGetPokemon = (req, res) => {
  let response = POKEDEX.pokemon;

  // filter our pokemon by name if query param is present
  if (req.query.name) {
    response = response.filter(pokemon => {
      return pokemon.name.toLowerCase().includes(req.query.name.toLowerCase());
    });
  }

  if (req.query.type) {
    response = response.filter(pokemon => {
      return pokemon.type.includes(req.query.type);
    });
  }
  res.json(response);
};

app.get('/pokemon', handleGetPokemon);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}...`);
});

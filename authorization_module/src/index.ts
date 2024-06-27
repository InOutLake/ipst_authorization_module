import express from 'express';
import { migrator } from './migrator';

let app = express();

app.post('/register', (req, res) => {
  // Registration logic here
  res.send('User registered');
});

app.post('/login', (req, res) => {
  // Authorization logic here
  res.send('User logged in');
});

migrator.migrateToLatest();
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

import express from 'express';
import { migrateToLatest } from './migrate';
import { config } from './config';
import { findUsers } from './UserRepository';

let app = express();

app.post('/login', async (req, res) => {
  let users = await findUsers({
    name: req.body.name,
    password: req.body.password
  });
  if (users.length === 0) {
    res.status(401).send('Invalid username or password');
  }
  let user = users[0];
  const payload = JSON.stringify({ name: user.name });
  const token = signJwt(payload, config.jwt.secret);
  res.json({ token });
});

app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const token = authHeader.split(' ')[1];
  try {
    const decoded = decodeJwt(token);
    const isValid = await verifyJwt(token, config.jwt.secret);
    if (!isValid) throw new Error('Invalid token');
    let user = findUsers({ name: JSON.parse(decoded.payload).name });
    req.user = user;
    next();
  } catch (error) {
    res.status(403).send('Forbidden');
  }
});

migrateToLatest();
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

import express from 'express';
import { migrateToLatest } from './migrate';
import { config } from './config';
import {
  createUser,
  findUsers,
  findUserById,
  updateUser
} from './UserRepository';
import { validateUser, validatePassword } from './validation';
import { NewUser } from './types/types';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import {
  generateTokens,
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken
} from './jwt';
import cookieParser from 'cookie-parser';

console.log(__dirname);
let app = express();

app.use(async (req, res) => {
  console.log(`[${new Date().toString()}] ${req.url}`);
});
app.use(cookieParser());
app.use(async (req, res, next) => {
  try {
    const accessToken = req.cookies['accessToken'];
    if (!accessToken) throw new Error('Access token cookie missing');
    const { userId } = verifyAccessToken(accessToken) as JwtPayload;
    const user = findUserById(userId);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);
    res.cookie('user', user, {
      expires: expires,
      httpOnly: true
    });
    console.log('User have logged in successfully!');
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) throw new Error('Refresh token cookie missing');

      try {
        const { userId } = verifyRefreshToken(refreshToken) as JwtPayload;
        const newAccessToken = generateAccessToken(userId);
        const user = findUserById(userId);
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: true
        });
      } catch (error) {
        req.cookies['user'] = null;
        console.log('User have been logged out');
        res.redirect('/login');
      }
    } else {
      throw error;
    }
  }
  next();
});

app.post('/login', async (req, res) => {
  if (req.cookies['user']) {
    res.redirect('/');
  }
  let users = await findUsers({
    name: req.body.name,
    password: req.body.password // TODO password is hashed
  });
  if (users.length === 0) {
    res.status(401).send('Invalid username or password');
  }
  let user = users[0];
  const { accessToken, refreshToken } = generateTokens(user.id);
  res.cookie('accessToken', accessToken, { httpOnly: true });
  res.cookie('refreshToken', refreshToken, { httpOnly: true });
});

app.post('/registration', async (req, res) => {
  try {
    validateUser(req.body);

    const newUserObject = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password, // TODO hash password
      is_confirmed: false,
      middlename: req.body.middlename || null,
      username: req.body.username || null
    };

    createUser(newUserObject);
  } catch (err) {
    return res.status(400).send((err as Error).message);
  }

  res.redirect('/login');
});

app.post('/password', async (req, res) => {
  try {
    const newPassword = req.body.password;
    validatePassword(newPassword);
    const email = req.body.email;
    const user = (await findUsers({ email: email }))[0];
    if (!user) {
      throw new Error('User not found');
    }
    updateUser(user.id, { password: newPassword }); // TODO hash password
  } catch (error) {
    // TODO handle error
  }
});

app.get('/', async (req, res) => {
  // testing purposes
  //res.send(`Hello ${req.user.name}`);
  res.send('Hello fellow user!');
});

migrateToLatest();
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from './config';

const accessSecret = config.jwt.acessSecret;
const refreshSecret = config.jwt.refreshSecret;

export function generateAccessToken(userId: number) {
  return jwt.sign({ userId: userId }, accessSecret, { expiresIn: '1h' });
}

export function generateRefreshToken(userId: number) {
  return jwt.sign({ userId: userId }, refreshSecret, {
    expiresIn: '1d'
  });
}

export function generateTokens(userId: number) {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
}

export function verifyAccessToken(accessToken: string) {
  return jwt.verify(accessToken, accessSecret);
}

export function verifyRefreshToken(refreshToken: string) {
  return jwt.verify(refreshToken, refreshSecret);
}

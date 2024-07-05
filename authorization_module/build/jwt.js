"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.generateTokens = generateTokens;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const accessSecret = config_1.config.jwt.acessSecret;
const refreshSecret = config_1.config.jwt.refreshSecret;
function generateAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ userId: userId }, accessSecret, { expiresIn: '1h' });
}
function generateRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ userId: userId }, refreshSecret, {
        expiresIn: '1d'
    });
}
function generateTokens(userId) {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    return { accessToken, refreshToken };
}
function verifyAccessToken(accessToken) {
    return jsonwebtoken_1.default.verify(accessToken, accessSecret);
}
function verifyRefreshToken(refreshToken) {
    return jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const migrate_1 = require("./migrate");
const UserRepository_1 = require("./UserRepository");
const validation_1 = require("./validation");
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_1 = require("./jwt");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
console.log(__dirname);
let app = (0, express_1.default)();
app.use((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[${new Date().toString()}] ${req.url}`);
}));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies['accessToken'];
        if (!accessToken)
            throw new Error('Access token cookie missing');
        const { userId } = (0, jwt_1.verifyAccessToken)(accessToken);
        const user = (0, UserRepository_1.findUserById)(userId);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 15);
        res.cookie('user', user, {
            expires: expires,
            httpOnly: true
        });
        console.log('User have logged in successfully!');
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken)
                throw new Error('Refresh token cookie missing');
            try {
                const { userId } = (0, jwt_1.verifyRefreshToken)(refreshToken);
                const newAccessToken = (0, jwt_1.generateAccessToken)(userId);
                const user = (0, UserRepository_1.findUserById)(userId);
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: true
                });
            }
            catch (error) {
                req.cookies['user'] = null;
                console.log('User have been logged out');
                res.redirect('/login');
            }
        }
        else {
            throw error;
        }
    }
    next();
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies['user']) {
        res.redirect('/');
    }
    let users = yield (0, UserRepository_1.findUsers)({
        name: req.body.name,
        password: req.body.password // TODO password is hashed
    });
    if (users.length === 0) {
        res.status(401).send('Invalid username or password');
    }
    let user = users[0];
    const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user.id);
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
}));
app.post('/registration', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validation_1.validateUser)(req.body);
        const newUserObject = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password, // TODO hash password
            is_confirmed: false,
            middlename: req.body.middlename || null,
            username: req.body.username || null
        };
        (0, UserRepository_1.createUser)(newUserObject);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
    res.redirect('/login');
}));
app.post('/password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPassword = req.body.password;
        (0, validation_1.validatePassword)(newPassword);
        const email = req.body.email;
        const user = (yield (0, UserRepository_1.findUsers)({ email: email }))[0];
        if (!user) {
            throw new Error('User not found');
        }
        (0, UserRepository_1.updateUser)(user.id, { password: newPassword }); // TODO hash password
    }
    catch (error) {
        // TODO handle error
    }
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // testing purposes
    //res.send(`Hello ${req.user.name}`);
    res.send('Hello fellow user!');
}));
(0, migrate_1.migrateToLatest)();
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

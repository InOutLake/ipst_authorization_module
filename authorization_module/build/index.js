"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const migrate_1 = require("./migrate");
let app = (0, express_1.default)();
app.post('/register', (req, res) => {
    // Registration logic here
    res.send('User registered');
});
app.post('/login', (req, res) => {
    // Authorization logic here
    res.send('User logged in');
});
(0, migrate_1.migrateToLatest)();
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

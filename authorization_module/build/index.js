"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const migrator_1 = require("./migrator");
let app = (0, express_1.default)();
app.post('/register', (req, res) => {
    // Registration logic here
    res.send('User registered');
});
app.post('/login', (req, res) => {
    // Authorization logic here
    res.send('User logged in');
});
migrator_1.migrator.migrateToLatest();
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

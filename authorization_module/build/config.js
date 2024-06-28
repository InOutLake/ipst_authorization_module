"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const fs = require('fs');
const configPath = './config.json';
let config;
try {
    const configFile = fs.readFileSync(configPath, 'utf8');
    exports.config = config = JSON.parse(configFile);
}
catch (error) {
    console.error(`Error reading config file: ${error.message}`);
}
console.log(typeof config.db.password, config.db.password);

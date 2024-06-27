"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrator = void 0;
const fs_1 = require("fs");
const kysely_1 = require("kysely");
const database_1 = require("./database");
const path_1 = __importDefault(require("path"));
exports.migrator = new kysely_1.Migrator({
    db: database_1.db,
    provider: new kysely_1.FileMigrationProvider({
        fs: fs_1.promises,
        path: path_1.default,
        migrationFolder: './migrations'
    })
});

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
exports.migrateToLatest = migrateToLatest;
const fs_1 = require("fs");
const kysely_1 = require("kysely");
const database_1 = require("./database");
const path_1 = __importDefault(require("path"));
function migrateToLatest() {
    return __awaiter(this, void 0, void 0, function* () {
        const migrator = new kysely_1.Migrator({
            db: database_1.db,
            provider: new kysely_1.FileMigrationProvider({
                fs: fs_1.promises,
                path: path_1.default,
                migrationFolder: path_1.default.join(__dirname, 'migrations')
            })
        });
        const { error, results } = yield migrator.migrateToLatest();
        results === null || results === void 0 ? void 0 : results.forEach((it) => {
            if (it.status === 'Success') {
                console.log(`migration "${it.migrationName}" was executed successfully`);
            }
            else if (it.status === 'Error') {
                console.error(`failed to execute migration "${it.migrationName}"`);
            }
        });
        if (error) {
            console.error('failed to migrate');
            console.error(error);
            database_1.db.destroy();
            process.exit(1);
        }
    });
}

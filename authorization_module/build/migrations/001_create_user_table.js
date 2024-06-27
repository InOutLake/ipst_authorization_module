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
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
function up(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema
            .createTable('users')
            .addColumn('id', 'serial', (col) => col.primaryKey())
            .addColumn('name', 'varchar(255)', (col) => col.notNull())
            .addColumn('surname', 'varchar(255)', (col) => col.notNull())
            .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
            .addColumn('password', 'varchar(255)', (col) => col.notNull())
            .addColumn('is_confirmed', 'boolean', (col) => col.notNull())
            .addColumn('middlename', 'varchar(255)')
            .addColumn('username', 'varchar(255)')
            .execute();
    });
}
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable('users').execute();
    });
}

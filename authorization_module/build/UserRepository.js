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
exports.createUser = createUser;
exports.findUsers = findUsers;
exports.findUserById = findUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.activateUser = activateUser;
const database_1 = require("./database");
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.db
            .insertInto('User')
            .values(user)
            .returningAll()
            .executeTakeFirstOrThrow();
    });
}
function findUsers(criteria) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = database_1.db.selectFrom('User');
        if (criteria.id) {
            query = query.where('id', '=', criteria.id);
        }
        if (criteria.name) {
            query = query.where('name', '=', criteria.name);
        }
        if (criteria.surname !== undefined) {
            query = query.where('surname', criteria.surname === null ? 'is' : '=', criteria.surname);
        }
        if (criteria.email) {
            query = query.where('email', '=', criteria.email);
        }
        if (criteria.password) {
            query = query.where('password', '=', criteria.password);
        }
        if (criteria.is_confirmed) {
            query = query.where('is_confirmed', '=', criteria.is_confirmed);
        }
        if (criteria.middlename !== undefined) {
            query = query.where('middlename', criteria.middlename === null ? 'is' : '=', criteria.middlename);
        }
        if (criteria.username !== undefined) {
            query = query.where('username', criteria.username === null ? 'is' : '=', criteria.username);
        }
        return yield query.selectAll().execute();
    });
}
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.db
            .selectFrom('User')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();
    });
}
function updateUser(id, updateWith) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.db.updateTable('User').set(updateWith).where('id', '=', id).execute();
    });
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.db
            .deleteFrom('User')
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
    });
}
function activateUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.db
            .updateTable('User')
            .set({ is_confirmed: true })
            .where('id', '=', id)
            .execute();
    });
}

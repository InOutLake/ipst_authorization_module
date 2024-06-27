"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(name, surname, email, password, is_confirmed = false, middlename, username) {
        this.name = name;
        this.surname = surname;
        this.middlename = middlename;
        this.email = email;
        this.username = username;
        this.password = password;
        this.is_confirmed = is_confirmed;
    }
}
exports.User = User;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const kysely_1 = require("kysely");
const config_1 = require("./config");
const dialect = new kysely_1.PostgresDialect({
    pool: new pg_1.Pool({
        database: config_1.config.db.database,
        host: config_1.config.db.host,
        user: config_1.config.db.user,
        password: config_1.config.db.password,
        port: config_1.config.db.db_port,
        max: config_1.config.db.max_tries
    })
});
exports.db = new kysely_1.Kysely({
    dialect
});

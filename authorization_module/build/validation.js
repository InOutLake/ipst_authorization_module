"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const userSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(255).required(),
    surname: joi_1.default.string().min(2).max(255).required(),
    middlename: joi_1.default.string().max(255),
    email: joi_1.default.string().email({ minDomainSegments: 2 }).max(255).required(),
    username: joi_1.default.string().min(2).max(15),
    password: joi_1.default.string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
        .required(),
    is_confirmed: joi_1.default.boolean().default(false)
});
exports.userSchema = userSchema;
const validateUser = (user) => {
    const { error } = userSchema.validate(user);
    if (error) {
        throw new Error('User validation failed');
    }
};
exports.validateUser = validateUser;

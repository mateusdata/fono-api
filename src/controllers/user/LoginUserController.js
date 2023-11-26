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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserController = void 0;
const bcryptjs_1 = require("bcryptjs");
const prismaClient_1 = require("../../database/prismaClient");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUserController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const userExists = yield prismaClient_1.prismaClient.user.findFirst({
                where: {
                    email
                }
            });
            if (!(userExists === null || userExists === void 0 ? void 0 : userExists.email))
                return res.status(400).json("Email or password incorrect");
            const verifyPassword = yield (0, bcryptjs_1.compare)(password, userExists.password);
            if (!verifyPassword)
                return res.status(400).json("Email or password incorrect");
            const sec = process.env.ACESS_TOKEN_JWT;
            const token = jsonwebtoken_1.default.sign({ user: JSON.stringify(userExists) }, sec, { subject: userExists.id, expiresIn: "60m" });
            const { password: _ } = userExists, userLogin = __rest(userExists, ["password"]);
            return res.json({ user: userLogin, token: token });
        });
    }
}
exports.LoginUserController = LoginUserController;

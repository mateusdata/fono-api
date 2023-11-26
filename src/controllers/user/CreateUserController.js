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
exports.CreateUserController = void 0;
const prismaClient_1 = require("../../database/prismaClient");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class CreateUserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, username, email, password } = req.body;
            const userExists = yield prismaClient_1.prismaClient.user.findFirst({
                where: {
                    username
                }
            });
            if (userExists)
                return res.status(422).json("User already exists");
            const hashPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = yield prismaClient_1.prismaClient.user.create({
                data: {
                    name,
                    username,
                    email,
                    password: hashPassword
                }
            });
            return res.status(201).json(user);
        });
    }
}
exports.CreateUserController = CreateUserController;

import { compare } from 'bcryptjs';
import { Request, Response } from "express"
import { prismaClient } from "../../database/prismaClient"
import jwt from "jsonwebtoken"

export class LoginUserController {
    async login(req: Request, res: Response) {
        const {email, password} = req.body

        const userExists = await prismaClient.user.findFirst({
            where: {
                email
            }
        }) 

        if(!userExists?.email) return res.status(400).json("Email or password incorrect")

        const verifyPassword = await compare(password, userExists.password)

        if(!verifyPassword) return res.status(400).json("Email or password incorrect")

        const sec: string = process.env.ACESS_TOKEN_JWT as string

        const token = jwt.sign({user: JSON.stringify(userExists)}, sec, {subject: userExists.id, expiresIn: "60m"})

        const {password: _, ...userLogin} = userExists

        return res.json({user: userLogin, token: token})
    }
}
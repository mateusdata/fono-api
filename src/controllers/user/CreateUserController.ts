import { Request, Response } from "express"
import { prismaClient } from "../../database/prismaClient"
import bcrypt from "bcryptjs"

export class CreateUserController {
    async create(req: Request, res: Response) {
        const {name, username, email, password} = req.body

        const userExists = await prismaClient.user.findFirst({
            where: {
                username
            }
        })

        if(userExists) return res.status(422).json("User already exists")

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await prismaClient.user.create({
            data: {
                name,
                username,
                email,
                password: hashPassword
            }
        })

        return res.status(201).json(user)
    }
}
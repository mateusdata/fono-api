import {Request, Response} from "express"
import { prismaClient } from "../../database/prismaClient"

export class FindUserController {
    async find(req: Request, res: Response) {
        const user = await prismaClient.user.findMany()

        return res.json(user)
    }
}
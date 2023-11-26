import { Request, Response } from "express"
import { prismaClient } from "../../database/prismaClient"

export class FindByIdUserController {
    async findById(req: Request, res: Response) {
        const id = req.params.id

        const userById = await prismaClient.user.findFirst({
            where: {
                id
            }
        })

        if(!userById) return res.status(404).json("User not found")

        return res.json(userById)
    }
}
import { Request, Response } from "express"
import { prismaClient } from "../../database/prismaClient"

export class DeleteUserController {
    async delete(req: Request, res: Response) {
        const id = req.params.id

        const userDelete = await prismaClient.user.delete({
            where: {
                id
            }
        })

        if(!userDelete) res.status(404).json("User was not found")

        return res.json(userDelete)
    }
}
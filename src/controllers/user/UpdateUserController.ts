import { Request, Response } from "express"
import { prismaClient } from "../../database/prismaClient"

export class UpdateUserController {
    async update(req: Request, res: Response) {
        const id = req.params.id
        const {name, username, email} = req.body

        try {
            const updateUser = await prismaClient.user.update({
                where: {
                    id
                },
                data: {
                    name: name,
                    username: username,
                    email: email, 
                }
            })

            return res.json("Update user successfully")
        } catch (error) {
            console.log(error)
            return error
        }
    }
}
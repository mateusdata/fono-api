import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { prismaClient } from "../database/prismaClient"

type JwtType = {
    id: string
}

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers

    if(!authorization) return res.status(401).json("Unauthorized")

    const token = authorization.split(" ")[1]

    const sec: string = process.env.ACESS_TOKEN_JWT as string

    const {id} = jwt.verify(token, sec) as JwtType

    const user = await prismaClient.user.findFirst({
        where: {id}
    })

    if(!user) return res.status(401).json("Unauthorized")

    req.userId = id

    return next()
}
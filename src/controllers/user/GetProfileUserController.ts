import { Request, Response } from "express";

export class GetProfileUserController {
    async getProfile(req: Request, res: Response) {
        return res.json("LOGADO")
    }
}
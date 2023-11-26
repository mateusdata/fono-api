import { Auth } from './middleware/Auth';
import { Router } from "express"

import { CreateUserController } from "./controllers/user/CreateUserController"
import { FindUserController } from "./controllers/user/FindUserController"
import { FindByIdUserController } from "./controllers/user/FindByIdUserController"
import { DeleteUserController } from "./controllers/user/DeleteUserController"
import { UpdateUserController } from "./controllers/user/UpdateUserController"
import { LoginUserController } from "./controllers/user/LoginUserController"
import { GetProfileUserController } from "./controllers/user/GetProfileUserController"

const createUserController = new CreateUserController
const findUserController = new FindUserController
const findByIdUserController = new FindByIdUserController
const deleteUserController = new DeleteUserController
const updateUserController = new UpdateUserController

const loginUserController = new LoginUserController

const getProfileUserController = new GetProfileUserController

const router = Router()

router.post("/users", createUserController.create)
router.get("/users", findUserController.find)
router.get("/users/:id", findByIdUserController.findById)
router.delete("/users/:id", deleteUserController.delete)
router.put("/users/:id", updateUserController.update)

router.post("/login", loginUserController.login)
router.use(Auth)

router.get("/profile", getProfileUserController.getProfile)

export default router
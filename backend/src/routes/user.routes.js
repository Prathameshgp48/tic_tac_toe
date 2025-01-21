import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { loginUser, logoutUser, registerUser, updateUserProfile, getUser } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/profile").get(verifyJWT, getUser)
userRouter.route("/update-profile").patch(verifyJWT, updateUserProfile)

export { userRouter }
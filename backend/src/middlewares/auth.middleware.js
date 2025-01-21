import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            return res.status(402).json({ message: "Unauthorized request" })
        }
        //  console.log('token received:', token)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password")

        if (!user) {
            return res.status(402).json({ message: "Unauthorized request" })
        }

        req.user = user
        next()
    } catch (error) {
        console.log("Error", error)
        return res.status(402).json({ message: "Invalid Token" })
    }
}

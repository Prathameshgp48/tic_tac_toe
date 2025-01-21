import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    isOnline: {
        type: Boolean,
        default: false
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = async function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
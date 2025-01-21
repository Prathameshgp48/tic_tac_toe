import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { userRouter } from './routes/user.routes.js'
import { gameRouter } from './routes/game.routes.js'
import cors from 'cors'

const app = express()

dotenv.config({
    path: './.env',
})

app.use(urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: 'http://localhost:5173'}))

//routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/game", gameRouter)

export { app }

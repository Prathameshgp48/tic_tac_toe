import { configDotenv } from "dotenv"
import connectDB from "./db/db.js"
import { app } from "./app.js"

configDotenv({ path: "./.env" })

const port = process.env.PORT || 3010

connectDB()
    .then(() => {
        app.on("ERROR", (error) => {
            console.log("ERROR:", error)
            throw error
        })

        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    }).catch((error) => console.log("Connection Failed!!", error))
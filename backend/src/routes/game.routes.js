import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { currentGame, getGame, getMatchHistory, makeMove, startGame } from "../controllers/game.controller.js"


const gameRouter = Router()

gameRouter.route("/start-game").post(verifyJWT, startGame)
gameRouter.route("/make-move").post(verifyJWT, makeMove)
gameRouter.route("/history").get(verifyJWT, getMatchHistory)
gameRouter.route("/active-games").post(verifyJWT, getGame)
gameRouter.route("/:gameId").get(verifyJWT, currentGame)

export { gameRouter }
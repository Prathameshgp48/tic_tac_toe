import { Game } from "../models/game.model.js"
import { User } from "../models/user.model.js"

const isWinner = (board) => {

    for (let i = 0; i < 3; i++) {
        //checking for row match
        if (board[i][0] && board[i][0] == board[i][1] && board[i][1] === board[i][2]) {
            return true
        }

        //checking for column match
        if (board[0][i] && board[0][i] == board[1][i] && board[1][i] === board[2][i]) {
            return true
        }
    }

    //checking for diagonal match
    if (board[0][0] && board[0][0] == board[1][1] && board[1][1] === board[2][2]) {
        return true
    }

    if (board[0][2] && board[0][2] == board[1][1] && board[1][1] === board[2][0]) {
        return true
    }

    return false

}

const startGame = async (req, res) => {
    const { opponentUsername } = req.body
    const currentUser = req.user.username

    try {
        const opponent = await User.findOne({ username: opponentUsername })
        if (!opponent) {
            return res.status(400).json({ message: "Opponent not found" })
        }

        if (!opponent.isOnline) {
            return res.status(400).json({ message: "Opponent is Offline" })
        }

        if (opponentUsername === currentUser) {
            return res.status(400).json({ message: "You can't play with yourself" })
        }

        // const userActiveGame = await Game.findOne({
        //     status: 'ongoing',
        //     $or: [{ player1: currentUser }, { player2: currentUser }],
        // })

        // if (userActiveGame) {
        //     return res.status(400).json({ message: 'You are already in an active game' });
        // }

        //check if both player doesn'nt create individual game
        const existingGame = await Game.findOne({
            $or: [
                { player1: currentUser, player2: opponentUsername, gameStatus: 'ongoing' },
                { player1: opponentUsername, player2: currentUser, gameStatus: 'ongoing' },
            ]
        })

        //if any player found game already created by opponent
        if (existingGame) {

            console.log("Game found", existingGame)
            return res.status(200).json({ success: true, game: existingGame })
        }

        const newGame = await Game.create({
            player1: currentUser,
            player2: opponentUsername,
            board: Array(3).fill(null).map(() => Array(3).fill(null)),
            currentTurn: currentUser,
            gameStatus: 'ongoing',
            winner: null
        })

        return res.status(201).json({ game: newGame, success: true, message: "Game created" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

const makeMove = async (req, res) => {

    const { gameId, position } = req.body
    console.log(gameId)
    try {
        const game = await Game.findById(gameId)

        if (!game) {
            return res.status(400).json({ message: "Game not found" })
        }

        if (game.gameStatus !== "ongoing") {
            return res.status(400).json({ message: "Game is not ongoing!!" })
        }

        if (game.currentTurn !== req.user.username) {
            return res.status(401).json({ message: "Hey, It's Opponent's Turn" })
        }

        const [row, col] = position
        if (row < 0 || row >= 3 || col < 0 || col >= 3) {
            return res.status(402).json({ message: "Invalid Move!" })
        }

        if (game.board[row][col] !== null) {
            return res.status(403).json({ message: "Position Occupied" })
        }

        game.board[row][col] = req.user.username === game.player1 ? 'X' : 'O'
        game.moves.push({
            player: req.user.username,
            position,
            timestamp: new Date()
        })


        //looking for winner after every move
        if (isWinner(game.board)) {
            game.gameStatus = 'completed'
            game.winner = req.user.username
            await game.save()
            return res.status(200).json({ game, success: true, message: `${req.user.username} won the game` })
        }

        //looking for draw
        if (game.moves.length === 9) {
            game.gameStatus = 'draw'
            await game.save()
            return res.status(200).json({ game, success: true, message: 'Match Drawn!! Tough one' })
        }

        //updating game turn
        game.currentTurn = game.player1 === req.user.username ? game.player2 : game.player1


        await game.save()

        return res.status(200).json({ message: "Move made successfully", board: game.board })
    } catch (error) {
        console.log("Error", error)
        return res.status(500).json({ message: "Something went wrong while making move!!" })
    }
}

const getMatchHistory = async (req, res) => {
    const username = req.user.username

    try {
        const games = await Game.find({
            gameStatus: { $in: ['completed', 'draw'] },
            $or: [{ player1: username }, { player2: username }]
        }).sort({ createdAt: -1 })

        if (!games || games.length === 0) {
            return res.status(404).json({ message: "No History Found!! Battle with opponents to create history." })
        }

        const history = games.map(game => {
            const opponent = game.player1 === username ? game.player2 : game.player1
            return {
                gameId: game._id,
                opponent,
                result:
                    game.gameStatus === 'draw' ?
                        'Draw' : game.winner === username ?
                            "You Won" : "You Lost",
                moves: game.moves.map((move) => ({
                    player: move.player,
                    position: move.position,
                    timestamp: move.timestamp,
                })),
                gameStarted: game.createdAt,
                gameEnded: game.updatedAt
            }
        })

        return res.status(200).json({ success: true, history })
    } catch (error) {
        console.log('Error', error)
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

const getGame = async (req, res) => {
    const { username } = req.user

    try {
        const games = await Game.find({
            gameStatus: { $in: ['ongoing'] },
            $or: [{ player1: username }, { player2: username }]
        })

        if (!games || games.length === 0) {
            return res.status(200).json({ success: true, message: 'No active games found', games: [] });
        }

        console.log(games)
        return res.status(200).json({ games, success: true })
    } catch (error) {
        console.log('Error', error)
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

const currentGame = async (req, res) => {
    const { gameId } = req.params

    try {
        const currentGame = await Game.findById(gameId)
        if (!currentGame) {
            return res.status(404).json({ message: "Game not found", success: false })
        }

        return res.status(200).json({ success: true, currentGame })
    } catch (error) {
        console.log('Error', error)
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

export {
    startGame,
    makeMove,
    getMatchHistory,
    getGame,
    currentGame
}
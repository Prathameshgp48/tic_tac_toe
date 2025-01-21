import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const gameSchema = new mongoose.Schema({
    player1: {
        type: String,
        required: true
    },
    player2: {
        type: String,
        required: true
    },
    board: {
        type: [[String]],
        required: true,
    },
    currentTurn: {
        type: String,
        required: true
    },
    gameStatus: {
        type: String,
        enum: ['ongoing', 'completed', 'draw'],
        default: 'ongoing'
    },
    winner: {
        type: String,
        default: null
    },
    moves: [
        {
            player: {
                type: String,
                required: true
            },
            position: {
                type: [Number],
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
})

export const Game = mongoose.model('Game', gameSchema)
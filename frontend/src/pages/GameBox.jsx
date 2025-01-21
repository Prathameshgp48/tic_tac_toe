import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const GameBox = () => {
  const [game, setGame] = useState(null);
  const { gameId } = useParams();
  const [playerSymbol, setPlayerSymbol] = useState("");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const currentGame = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/game/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.currentGame);
        setGame(response.data.currentGame);
        if (response.data.currentGame.player1 === username) {
          setPlayerSymbol("X");
        } else {
          setPlayerSymbol("O");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    currentGame();
  }, [gameId, username]);

  useEffect(() => {
    const interval = setInterval(() => {
      currentGame();
    }, 2000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (game?.gameStatus === "completed" || game?.gameStatus === "draw") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [game?.gameStatus, navigate]);

  const handleMove = async (row, col) => {
    if (game?.gameStatus === "completed" || game?.gameStatus === "draw") {
      return;
    }

    if (game?.currentTurn !== username) {
      toast.info("Hey, It's not your turn");
      return;
    }

    if(game?.positions[row][col] !== null) {
      toast.info("Position already occupied");
      return;   
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/game/make-move`,
        {
          gameId,
          position: [row, col],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setGame(response.data.game);
      } else {
        console.log(response.data);
        toast.info(response.data.message);
        setToastKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.log("Error while making move", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col justify-center items-center p-6">
      {game ? (
        <>
          <div className="flex justify-center items-center gap-3 mb-6 text-center">
            <h1 className="text-3xl font-bold text-red-500 font-mono mb-6 text-center">
              {game.player1}
            </h1>
            <p className="text-center">Vs</p>
            <h1 className="text-3xl font-bold text-blue-500 font-mono mb-6 text-center">
              {game.player2}
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {game.gameStatus === "completed"
              ? `${game.winner} won!`
              : game.gameStatus === "draw"
              ? "It's a draw!"
              : `Turn: ${
                  game.currentTurn === game.player1
                    ? game.player1 === username
                      ? "Your Turn"
                      : "Opponent Turn"
                    : game.player2 === username
                    ? "Your Turn"
                    : "Opponent Turn"
                }`}
          </h2>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {game.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 flex items-center justify-center border-2 rounded-md ${
                    cell === "X"
                      ? "bg-red-500 text-white font-bold text-3xl"
                      : cell === "O"
                      ? "bg-green-500 text-white font-bold text-3xl"
                      : "bg-white hover:bg-gray-200"
                  } cursor-pointer transition duration-300`}
                  onClick={() => handleMove(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              ))
            )}
          </div>

          <p className="text-white text-lg mt-8">
            You are playing as:{" "}
            <span className="font-bold">
              {playerSymbol === "X" ? "Player 1 (X)" : "Player 2 (O)"}
            </span>
          </p>
        </>
      ) : (
        <p className="text-white text-2xl font-semibold">Loading game...</p>
      )}
    </div>
  );
};

export default GameBox;

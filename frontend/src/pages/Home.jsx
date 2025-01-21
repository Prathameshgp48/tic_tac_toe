import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [games, setGames] = useState([]);
  const [opponentUsername, setOpponentUsername] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchGames();
    }
  }, [token, navigate]);

  const fetchGames = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/game/active-games",
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setGames(response.data.games);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startGame = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/game/start-game",
        { opponentUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const gameId = response.data.game._id;
        setGames(response.data.games);
        navigate(`/game/${gameId}`);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log("Error while starting game", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome,{" "}
        <Link
          to={"/profile"}
          className="text-orange-500 hover:text-orange-300 font-bold font-serif"
        >
          {username}
        </Link>
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex flex-col mt-2 justify-center items-center">
          {games.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-2">Active Games:</h2>
              <ul>
                {games &&
                  games.length > 0 &&
                  games.map((game) => (
                    <li key={game._id} className="mb-2">
                      {`Game with ${
                        game.player1 === username ? game.player2 : game.player1
                      }`}
                      <button
                        onClick={() => navigate(`/game/${game._id}`)}
                        className="ml-4 text-blue-500"
                      >
                        Join
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <h2 className="text-xl font-semibold mb-2">{message}</h2>
          )}
        </div>
        <Link to={"/history"} className="text-blue-700 font-bold">
          Recent Matches
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Start a New Game</h2>
        <input
          type="text"
          placeholder="Enter opponent's username"
          value={opponentUsername}
          onChange={(e) => setOpponentUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-4 w-full"
        />
        <button
          onClick={startGame}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Home;

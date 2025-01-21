import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const token = localStorage.getItem("token");

  const fetchMatchHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/game/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("match history:", response.data.history);
        setMatches(response.data.history);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchMatchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Recent Matches
        </h1>
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.gameId}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Opponent: {match.opponent}
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    match.result === "You Won"
                      ? "bg-green-200 text-green-800"
                      : match.result === "You Lost"
                      ? "bg-red-200 text-red-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {match.result}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 mb-4">
                <p>
                  <span className="font-medium">Game Started:</span>{" "}
                  {new Date(match.gameStarted).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Moves:</span>{" "}
                  {match.moves.length}
                </p>
              </div>

              {/* Timeline of moves */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Move Timeline
                </h3>
                <div className="space-y-2">
                  {match.moves.map((move, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-gray-600"
                    >
                      <p>
                        <span className="font-medium">{move.player}</span> made
                        a move at position{" "}
                        {`(${move.position[0]}, ${move.position[1]})`}{" "}
                        <span className="text-sm">
                          ({new Date(move.timestamp).toLocaleTimeString()})
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MatchHistory;

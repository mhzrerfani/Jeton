// src/pages/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import Player from "./_components/Player";
import Table from "./_components/Table";
import {
  initialState,
  dealCards,
  takeTurn,
  placeBet,
  advanceTurn,
} from "@/utils/gameLogic";
import { GameState } from "@/types";

const avatars = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
  // Add more URLs for additional players
];

const HomePage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  useEffect(() => {
    if (gameState.players[gameState.currentPlayer].isAI) {
      // Use a recursive setTimeout to ensure AI acts every turn
      const aiTurn = () => {
        takeTurn(gameState, gameState.currentPlayer, setGameState);
      };

      const timer = setTimeout(aiTurn, 2000);

      return () => clearTimeout(timer); // Clear the timeout on cleanup
    }
  }, [gameState]);

  const handleBet = (amount: number) => {
    const newState = { ...gameState };
    placeBet(newState, gameState.currentPlayer, amount);
    advanceTurn(newState, setGameState);
  };

  const handleFold = () => {
    const newState = { ...gameState };
    newState.players[gameState.currentPlayer].hasFolded = true;
    advanceTurn(newState, setGameState);
  };

  const currentPhase = gameState.phase;
  const currentPlayer = gameState.players[gameState.currentPlayer];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <Table communityCards={gameState.communityCards} pot={gameState.pot} />
      <div className="flex flex-wrap justify-center mb-6">
        {gameState.players.map((player, index) => (
          <Player
            key={index}
            name={player.name}
            hand={player.hand}
            chips={player.chips}
            isCurrent={gameState.currentPlayer === index}
            avatar={avatars[index]}
            duration={5000} // Set the round duration in milliseconds
            onTimeout={handleFold} // Automatically fold if timeout
            isUser={!player.isAI} // Identify if the player is the user
          />
        ))}
      </div>
      <div className="text-center">
        <p className="mb-2">Current Phase: {currentPhase}</p>
        <p className="mb-4">Current Player: {currentPlayer.name}</p>
        {currentPhase !== "showdown" && !currentPlayer.isAI && (
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              onClick={() => handleBet(10)}
            >
              Bet 10
            </button>
            <button
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              onClick={handleFold}
            >
              Fold
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

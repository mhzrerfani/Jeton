// src/_components/Player.tsx
"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";

type CardType = {
  suit: string;
  value: string;
};

type PlayerProps = {
  name: string;
  hand: CardType[];
  chips: number;
  isCurrent: boolean;
  avatar: string;
  duration: number;
  onTimeout: () => void;
  isUser: boolean;
};

const Player: React.FC<PlayerProps> = ({
  name,
  hand,
  chips,
  isCurrent,
  avatar,
  duration,
  onTimeout,
  isUser,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isCurrent) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onTimeout(); // Call timeout function when progress completes
            return 100;
          }
          return prev + 1;
        });
      }, duration / 100);

      return () => clearInterval(interval);
    }
  }, [isCurrent, duration, onTimeout]);

  return (
    <div
      className={`flex flex-col items-center p-4 ${
        isCurrent ? "border-4 border-yellow-500" : "border-2 border-gray-300"
      }`}
    >
      <div className="relative w-24 h-24 mb-2">
        <img
          src={avatar}
          alt={name}
          className="w-full h-full rounded-full border-2 border-gray-100"
        />
        {isCurrent && (
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="red"
              strokeWidth="10"
              fill="none"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              className="transition-stroke-dashoffset duration-100 linear"
            />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <div className="flex justify-center gap-1 mt-2">
        {hand.map((card, index) => (
          <Card key={index} suit={card.suit} value={card.value} />
        ))}
      </div>
      <p className="mt-2 text-sm">Chips: {chips}</p>
    </div>
  );
};

export default Player;

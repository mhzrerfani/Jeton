// src/types/index.ts
export type Card = {
  suit: string;
  value: string;
};

export type Player = {
  name: string;
  hand: Card[];
  chips: number;
  hasFolded: boolean;
  isAI: boolean;
  currentBet: number; // Add this property
};

export type Phase = "pre-flop" | "flop" | "turn" | "river" | "showdown";

export type GameState = {
  deck: Card[];
  players: Player[];
  communityCards: Card[];
  pot: number;
  currentPlayer: number;
  phase: Phase;
  highestBet: number; // Add this property
};

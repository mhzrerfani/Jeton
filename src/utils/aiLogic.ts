// src/utils/aiLogic.ts
import { GameState } from "../types";
import { evaluateHands } from "./handEvaluator";

export const aiDecision = (
  state: GameState,
  aiIndex: number
): "bet" | "call" | "fold" => {
  const aiPlayer = state.players[aiIndex];
  const evaluatedPlayers = evaluateHands(state.players, state.communityCards);
  const aiEvaluation = evaluatedPlayers[aiIndex];

  // Simple decision-making logic based on hand strength
  if (aiEvaluation.handStrength >= 2000) {
    return "bet"; // Strong hand
  } else if (aiEvaluation.handStrength >= 1500) {
    if (aiPlayer.currentBet < state.highestBet) {
      return "call"; // Call if behind
    }
    return "bet"; // Otherwise, bet
  } else {
    if (aiPlayer.currentBet < state.highestBet) {
      return "call"; // Call to stay in the game
    }
    return "fold"; // Otherwise, fold
  }
};

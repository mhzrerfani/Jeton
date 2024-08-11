// src/utils/handEvaluator.ts
import { Player, Card } from "../types";
import { Hand } from "pokersolver";

type EvaluatedPlayer = Player & {
  handStrength: number;
  handName: string;
};

export const evaluateHands = (
  players: Player[],
  communityCards: Card[]
): EvaluatedPlayer[] => {
  return players.map((player) => {
    const allCards = player.hand.concat(communityCards);

    // Ensure there are at least 5 cards to evaluate
    if (allCards.length < 5) {
      return { ...player, handStrength: 0, handName: "Incomplete hand" };
    }

    const formattedCards = allCards.map((card) => {
      const valueMap: { [key: string]: string } = {
        "10": "T",
        J: "J",
        Q: "Q",
        K: "K",
        A: "A",
      };
      const value = valueMap[card.value] || card.value;
      return value + card.suit[0].toLowerCase();
    });

    const hand = Hand.solve(formattedCards);
    return {
      ...player,
      handStrength: hand.rank,
      handName: hand.descr,
    };
  });
};

export const determineWinner = (
  players: Player[],
  communityCards: Card[]
): Player[] => {
  const evaluatedHands = evaluateHands(players, communityCards);

  // Filter out players with incomplete hands
  const validHands = evaluatedHands.filter((player) => player.handStrength > 0);

  // Find the best hand value
  const bestHandValue = Math.min(
    ...validHands.map((player) => player.handStrength)
  );
  return validHands.filter((player) => player.handStrength === bestHandValue);
};

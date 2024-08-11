// src/utils/gameLogic.ts
import { TURN_DURATION_MS, SUITS, VALUES, PHASES } from "@/constants";
import { aiDecision } from "./aiLogic";
import { determineWinner } from "./handEvaluator";
import { Card, Player, GameState, Phase } from "@/types";

const createDeck = (): Card[] => {
  let deck: Card[] = [];
  for (let suit of SUITS) {
    for (let value of VALUES) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

export const initialState: GameState = {
  deck: createDeck(),
  players: [
    {
      name: "Player 1",
      hand: [],
      chips: 100,
      hasFolded: false,
      isAI: false,
      currentBet: 0,
    },
    {
      name: "AI Opponent",
      hand: [],
      chips: 100,
      hasFolded: false,
      isAI: true,
      currentBet: 0,
    },
  ],
  communityCards: [],
  pot: 0,
  currentPlayer: 0,
  phase: "pre-flop",
  highestBet: 0,
};

// Place a bet and update the game state
export const placeBet = (
  state: GameState,
  playerIndex: number,
  amount: number
) => {
  const player = state.players[playerIndex];
  const betAmount = Math.min(player.chips, amount);
  player.chips -= betAmount;
  player.currentBet += betAmount;
  state.pot += betAmount;
  if (player.currentBet > state.highestBet) {
    state.highestBet = player.currentBet;
  }
};

// Advance the turn and check for round completion
export const advanceTurn = (
  state: GameState,
  callback: (newState: GameState) => void
) => {
  const activePlayers = state.players.filter((player) => !player.hasFolded);
  const allMatched = activePlayers.every(
    (player) => player.currentBet === state.highestBet
  );
  const onlyOneActive = activePlayers.length === 1;

  if (onlyOneActive || allMatched) {
    if (state.phase === "pre-flop") {
      state.phase = "flop";
      state.communityCards = [
        state.deck.pop()!,
        state.deck.pop()!,
        state.deck.pop()!,
      ];
    } else if (state.phase === "flop") {
      state.phase = "turn";
      state.communityCards.push(state.deck.pop()!);
    } else if (state.phase === "turn") {
      state.phase = "river";
      state.communityCards.push(state.deck.pop()!);
    } else if (state.phase === "river") {
      state.phase = "showdown";
      // Handle showdown logic here
    }

    // Reset bets for the next round
    state.players.forEach((player) => (player.currentBet = 0));
    state.highestBet = 0;
  } else {
    // Advance to the next player
    do {
      state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
    } while (state.players[state.currentPlayer].hasFolded);
  }

  setTimeout(() => {
    callback(state);
  }, TURN_DURATION_MS);
};

// Handle AI decisions and advance the turn
export const takeTurn = (
  state: GameState,
  playerIndex: number,
  callback: (newState: GameState) => void
) => {
  const newState = { ...state };
  const currentPlayer = newState.players[playerIndex];

  if (currentPlayer.isAI) {
    const decision = aiDecision(newState, playerIndex);
    if (decision === "bet") {
      placeBet(newState, playerIndex, 10);
    } else if (decision === "call") {
      placeBet(
        newState,
        playerIndex,
        newState.highestBet - currentPlayer.currentBet
      );
    } else if (decision === "fold") {
      currentPlayer.hasFolded = true;
    }
    advanceTurn(newState, callback);
  } else {
    // Automatically fold the player if they do not act within the duration
    setTimeout(() => {
      if (newState.currentPlayer === playerIndex) {
        newState.players[playerIndex].hasFolded = true;
        advanceTurn(newState, callback);
      }
    }, TURN_DURATION_MS);
  }
};

export const dealCards = (state: GameState): GameState => {
  if (state.phase === "showdown") {
    const winners = determineWinner(state.players, state.communityCards);
    const potSplit = state.pot / winners.length;

    const updatedPlayers = state.players.map((player) => {
      if (winners.includes(player)) {
        return { ...player, chips: player.chips + potSplit };
      }
      return player;
    });

    return {
      ...state,
      pot: 0,
      phase: "pre-flop",
      communityCards: [],
      players: updatedPlayers.map((player) => ({
        ...player,
        hand: [],
        hasFolded: false,
        currentBet: 0,
      })),
      deck: createDeck(),
    };
  } else {
    return nextPhaseLogic(state);
  }
};

const nextPhaseLogic = (state: GameState): GameState => {
  switch (state.phase) {
    case "pre-flop":
      return {
        ...state,
        players: state.players.map((player) => ({
          ...player,
          hand: [state.deck.pop()!, state.deck.pop()!],
        })),
        phase: "flop",
      };
    case "flop":
      return {
        ...state,
        communityCards: [
          state.deck.pop()!,
          state.deck.pop()!,
          state.deck.pop()!,
        ],
        phase: "turn",
      };
    case "turn":
      return {
        ...state,
        communityCards: [...state.communityCards, state.deck.pop()!],
        phase: "river",
      };
    case "river":
      return {
        ...state,
        communityCards: [...state.communityCards, state.deck.pop()!],
        phase: "showdown",
      };
    default:
      return state;
  }
};

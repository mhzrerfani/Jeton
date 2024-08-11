export const TURN_DURATION_MS = 2000; // Duration in milliseconds (2 seconds)

export const SUITS = ["♠", "♥", "♦", "♣"] as const;
export const VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

export const PHASES = [
  "pre-flop",
  "flop",
  "turn",
  "river",
  "showdown",
] as const;

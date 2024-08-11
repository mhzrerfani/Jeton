// components/Table.tsx
import React from "react";
import Card from "./Card";

type CardType = {
  suit: string;
  value: string;
};

type TableProps = {
  communityCards: CardType[];
  pot: number;
};

const Table: React.FC<TableProps> = ({ communityCards, pot }) => (
  <div className="flex flex-col items-center mb-6">
    <div className="flex gap-1 mb-2">
      {communityCards.map((card, index) => (
        <Card key={index} suit={card.suit} value={card.value} />
      ))}
    </div>
    <p className="text-lg font-semibold">Pot: {pot}</p>
  </div>
);

export default Table;

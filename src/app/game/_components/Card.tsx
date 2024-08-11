// components/Card.tsx
import React from "react";

type CardProps = {
  suit: string;
  value: string;
};

const Card: React.FC<CardProps> = ({ suit, value }) => (
  <div className="inline-block border border-gray-200 px-2 py-1 rounded bg-green-500 text-white font-bold">
    <span>{value}</span>
    <span>{suit}</span>
  </div>
);

export default Card;

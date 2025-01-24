import React from "react";
import Card from "./Card";
import { Card as CardType } from "../types/types";

interface CardListProps {
  cards: CardType[];
  onUpvote: (id: string) => void;
  onView: (card: CardType) => void;
  canUpvote: boolean;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  onUpvote,
  onView,
  canUpvote,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card
          key={card._id}
          name={card.name}
          description={card.description}
          upvotes={card.upvotes}
          storypoints={card.storypoints}
          media={card.media}
          onView={() => onView(card)}
          onUpvote={() => onUpvote(card._id)}
          canUpvote={canUpvote}
        />
      ))}
    </div>
  );
};

export default CardList;

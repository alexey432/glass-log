import React, { useState, useEffect, useRef } from "react";
import { fetchCards, createCard, updateCard } from "../api/cardsApi";
import { fetchKeys, updateKey } from "../api/keysApi";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLock, FiPlus } from "react-icons/fi";
import { FaClock, FaStar, FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import CardList from "../components/CardList";
import AddCardModal from "../components/AddCardModal";
import ViewCardModal from "../components/ViewCardModal";
import { Card } from "../types/types";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { MemberState } = location.state || { MemberState: false };

  const [cards, setCards] = useState<Card[]>([]);
  const [viewingCard, setViewingCard] = useState<Card | null>(null);
  const [availableVotes, setAvailableVotes] = useState<number>(0);
  const [maxQuota, setMaxQuota] = useState<number>(10);
  const [keyId, setKeyId] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const totalCapacity = 100;

  const voteEnd = useRef(new Date().getTime() + 3600 * 1000);
  const [remainingTime, setRemainingTime] = useState(
    voteEnd.current - new Date().getTime()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsData, keysData] = await Promise.all([
          fetchCards(),
          fetchKeys(),
        ]);

        setCards(cardsData);

        const currentKey = keysData.find((key: any) => key.client === "admin");
        if (currentKey) {
          setAvailableVotes(currentKey.votes);
          setMaxQuota(currentKey.quota);
          setKeyId(currentKey._id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = voteEnd.current - now;
      if (timeLeft <= 0) {
        clearInterval(interval);
        setRemainingTime(0);
      } else {
        setRemainingTime(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleUpvote = async (id: string) => {
    if (availableVotes <= 0) {
      alert("No votes available.");
      return;
    }
    try {
      // Optimistically update UI before backend confirmation
      setCards((prevCards) =>
        prevCards.map((card) =>
          card._id === id ? { ...card, upvotes: card.upvotes + 1 } : card
        )
      );
      if (viewingCard && viewingCard._id === id) {
        setViewingCard(
          (prev) => prev && { ...prev, upvotes: prev.upvotes + 1 }
        );
      }
      setAvailableVotes((prev) => prev - 1);

      // Update backend
      await updateCard(id, { $inc: { upvotes: 1 } });
      if (keyId) {
        await updateKey(keyId, { votes: availableVotes - 1 });
      }
    } catch (error) {
      console.error("Error upvoting card:", error);
      alert("Failed to upvote. Please try again.");
    }
  };

  const handleAddCard = async (
    name: string,
    description: string,
    media: string[]
  ) => {
    const newCard: Omit<Card, "_id" | "upvotes"> = {
      name,
      description,
      storypoints: 0,
      media,
    };

    try {
      const addedCard = await createCard(newCard);
      setCards((prevCards) => [...prevCards, addedCard]);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleViewCard = (card: Card) => {
    setViewingCard(card);
  };

  const sortedCards = [...cards].sort((a, b) => b.upvotes - a.upvotes);
  let remainingCapacity = totalCapacity;
  const leaderboard = sortedCards.map((card) => {
    if (remainingCapacity >= card.storypoints) {
      remainingCapacity -= card.storypoints;
      return { ...card, isWinner: true };
    }
    return { ...card, isWinner: false };
  });

  return (
    <div className="h-screen flex overflow-hidden">
      <div
        className="w-3/4 p-6 relative overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200"
        style={{ backgroundImage: "url('/src/assets/background.svg')" }}
      >
        <div className="flex items-center mb-4 sticky top-0 z-10 p-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-3xl font-bold text-black ml-4">Инициативы</h2>
        </div>

        <CardList
          cards={cards}
          onUpvote={handleUpvote}
          onView={handleViewCard}
          canUpvote={MemberState && availableVotes > 0}
        />

        {MemberState && (
          <div className="sticky bottom-6 right-6 flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
            >
              <FiPlus className="w-6 h-6" />
            </button>
          </div>
        )}

        {showModal && (
          <AddCardModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddCard}
          />
        )}
      </div>

      {viewingCard && (
        <ViewCardModal
          card={viewingCard} // Pass updated card
          onClose={() => setViewingCard(null)}
          onUpvote={handleUpvote}
          canUpvote={MemberState && availableVotes > 0}
        />
      )}

      <div className="w-1/4 bg-gray-200 p-6 overflow-y-auto flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-black">
          До конца голосования {formatTime(remainingTime)}
        </h2>
        <div
          className={`p-4 shadow-md rounded-md ${
            MemberState ? "bg-white" : "bg-gray-300 text-gray-500"
          } flex justify-between items-center`}
        >
          <div className="flex items-center">
            <FaStar
              className={`w-5 h-5 mr-2 ${
                MemberState ? "text-yellow-500" : "text-gray-400"
              }`}
            />
            <h3 className="text-xl font-bold">Доступные голоса</h3>
          </div>
          {MemberState ? (
            <p className="text-lg text-gray-700 font-semibold">
              {availableVotes}/{maxQuota}
            </p>
          ) : (
            <FiLock className="w-5 h-5 ml-2 text-gray-400" />
          )}
        </div>

        <div className="p-4 bg-white shadow-md rounded-md">
          <div className="text-xl font-bold flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaClock className="text-gray-500 w-5 h-5 mr-2" />
              Капасити команды
            </div>
            <span className="text-lg text-gray-700 font-semibold">
              {remainingCapacity}/{totalCapacity}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center text-xl font-bold mb-4">
            <h3>Топ голосования</h3>
            <div
              className="ml-2 text-gray-500 cursor-pointer hover:text-gray-700"
              data-tooltip-id="leaderboard-info"
              data-tooltip-content="Инициативы подбираются на основе кол-ва голосов и капасити команды."
            >
              <FaInfoCircle className="w-5 h-5" />
            </div>
            <Tooltip id="leaderboard-info" />
          </div>
          <ul className="space-y-4">
            {leaderboard.map((card) => (
              <li
                key={card._id}
                className={`p-3 rounded shadow-md flex justify-between items-center ${
                  card.isWinner
                    ? "bg-green-100 border-l-4 border-green-500"
                    : "bg-gray-100"
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-medium">{card.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <FaStar className="text-yellow-500 w-4 h-4 mr-1" />
                    <span>{card.upvotes} Голосов</span>
                  </div>
                </div>
                <span className="text-gray-600">{card.storypoints} SP</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

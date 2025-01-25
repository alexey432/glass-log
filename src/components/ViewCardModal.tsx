import React from "react";
import { FaStar, FaClock } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";

interface Card {
  _id: string;
  name: string;
  description: string; // Contains HTML content
  upvotes: number;
  storypoints: number;
  media: string[];
}

interface ViewCardModalProps {
  card: Card;
  onClose: () => void;
  onUpvote: (id: string) => void;
  canUpvote: boolean;
}

const ViewCardModal: React.FC<ViewCardModalProps> = ({
  card,
  onClose,
  onUpvote,
  canUpvote,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full relative overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">{card.name}</h2>

        {/* Description */}
        <div className="bg-gray-100 p-4 rounded mb-6">
          <div
            className="text-gray-700 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: card.description }}
          ></div>
        </div>

        {/* Media Section */}
        {card.media.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {card.media.map((url, index) => (
              <Zoom key={index}>
                <img
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-48 object-cover rounded shadow-md"
                />
              </Zoom>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="flex justify-between items-center text-gray-700 mb-6">
          {/* Upvotes */}
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-500 w-5 h-5" />
            <span className="text-lg font-medium">{card.upvotes} Votes</span>
          </div>

          {/* Storypoints */}
          <div className="flex items-center gap-2">
            <FaClock className="text-gray-500 w-5 h-5" />
            <span>{card.storypoints} SP</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Close
          </button>
          <button
            onClick={() => canUpvote && onUpvote(card._id)}
            disabled={!canUpvote}
            className={`px-4 py-2 font-semibold rounded ${
              canUpvote
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            } transition`}
          >
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCardModal;

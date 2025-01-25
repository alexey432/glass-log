import React from "react";
import { FaStar, FaClock } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface CardProps {
  name: string;
  description: string; // Contains HTML content
  upvotes: number;
  storypoints: number;
  media: string[];
  onView: () => void;
  onUpvote: () => void;
  canUpvote: boolean;
}

const Card: React.FC<CardProps> = ({
  name,
  description,
  upvotes,
  storypoints,
  media,
  onView,
  onUpvote,
  canUpvote,
}) => {
  const maxMedia = Math.min(4, media.length);

  return (
    <div className="relative p-4 rounded-lg shadow-md flex flex-col justify-between bg-white">
      {storypoints === 0 && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-80 blur"></div>
      )}
      {storypoints === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-red-500 text-white px-4 py-2 rounded text-lg font-semibold z-10">
            На оценке
          </span>
        </div>
      )}

      {/* Title and Stars */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold truncate max-w-[90%]">{name}</h3>
        <div
          className="flex items-center text-gray-700"
          data-tooltip-id={`stars-tooltip-${name}`}
          data-tooltip-content="Stars - кол-во голосов за доработку"
        >
          <FaStar className="text-yellow-500 w-5 h-5 mr-1" />
          <span className="text-lg font-semibold">{upvotes}</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-100 p-2 rounded mb-4 h-32 overflow-hidden">
        <div
          className="text-gray-700 text-sm overflow-hidden line-clamp-8 prose prose-sm max-w-none"
          title={description.replace(/<[^>]+>/g, "")} // Remove HTML tags for the tooltip
          dangerouslySetInnerHTML={{ __html: description }} // Render HTML content
        ></div>
      </div>

      {/* Media Section */}
      <div className="flex items-center gap-2 mb-4">
        {media.slice(0, maxMedia).map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Media ${index + 1}`}
            className="w-20 h-20 object-cover rounded"
          />
        ))}
        {media.length > maxMedia && (
          <div className="flex items-center justify-center px-3 bg-gray-300 rounded text-gray-600 font-bold w-20 h-20">
            +{media.length - maxMedia}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onView}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Подробнее
        </button>
        <button
          onClick={() => canUpvote && onUpvote()}
          className={`px-4 py-2 ${
            canUpvote
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white rounded`}
          disabled={!canUpvote}
        >
          Голосовать
        </button>
      </div>

      {/* Storypoints Tooltip */}
      <div
        className="absolute bottom-4 right-4 flex items-center text-gray-500"
        data-tooltip-id={`storypoints-tooltip-${name}`}
        data-tooltip-content="Story-point - условная оценка доработки, вычитается из общего капасити команды"
      >
        <FaClock className="w-4 h-4 mr-1" />
        <span>{storypoints}</span>
      </div>

      {/* ReactTooltip Components */}
      <Tooltip id={`stars-tooltip-${name}`} />
      <Tooltip id={`storypoints-tooltip-${name}`} />
    </div>
  );
};

export default Card;

import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/cards`;

// Fetch all cards
export const fetchCards = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Add a new card
export const createCard = async (card: {
  name: string;
  description: string;
  storypoints: number;
  media: string[];
}) => {
  const response = await axios.post(API_BASE_URL, card);
  return response.data;
};

// Update a card (e.g., upvote)
export const updateCard = async (id: string, updates: { [key: string]: any }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating card with ID ${id}:`, error);
      throw error; // Re-throw the error to handle it where this function is called
    }
  };

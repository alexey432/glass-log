import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/keys"; // Backend URL

// Fetch all keys
export const fetchKeys = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data; // Ensure quota is included
  };

// Add a new key
export const createKey = async (key: {
  key: string;
  client: string;
  weight: number;
  votes: number;
}) => {
  const response = await axios.post(API_BASE_URL, key);
  return response.data;
};

// Update a key (e.g., votes)
export const updateKey = async (id: string, updates: { [key: string]: any }) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating key with ID ${id}:`, error);
    throw error; // Re-throw the error to handle it where this function is called
  }
};

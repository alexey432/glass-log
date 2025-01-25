import axios from "axios";

// Use Vite's environment variable syntax
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Upload media file to the backend
export const uploadMedia = async (formData: FormData): Promise<string[]> => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/media/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return response.data.filePaths; // Expect an array of file paths
    } catch (error) {
      console.error("Error uploading media:", error);
      throw new Error("Failed to upload media.");
    }
  };
  
// Fetch all media files from the backend
export const fetchMedia = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/media`);
    return response.data; // Should be an array of media URLs or file paths
  } catch (error) {
    console.error("Error fetching media:", error);
    throw new Error("Failed to fetch media.");
  }
};

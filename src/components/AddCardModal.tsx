import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import { uploadMedia } from "../api/mediaApi";

interface MediaItem {
  preview: string; // Local preview URL
  url?: string; // Uploaded URL
}

interface AddCardModalProps {
  onClose: () => void;
  onAdd: (
    name: string,
    description: string,
    media: string[],
    storyPoints: number
  ) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  // Handle file drop
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      // Create previews and upload files
      const previews = acceptedFiles.map((file) => ({
        preview: URL.createObjectURL(file),
      }));

      setUploading(true);

      // Upload the new files
      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append("files", file));
      const uploadedPaths = await uploadMedia(formData);

      // Add uploaded files to the media state
      const newMediaItems = uploadedPaths.map((url, index) => ({
        preview: previews[index].preview, // Local preview
        url, // Uploaded URL from the backend
      }));

      setMedia((prev) => [...prev, ...newMediaItems]);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload some files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Remove media
  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      alert("Please fill out both fields.");
      return;
    }

    const mediaUrls = media.map((item) => item.url || item.preview);
    onAdd(name, description, mediaUrls, 0);
    onClose();
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"] },
    multiple: true,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Create a New Card</h2>
        <div className="max-h-[60vh] overflow-y-auto">
          <input
            type="text"
            placeholder="Card Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded focus:ring focus:ring-blue-500"
          />
          <ReactQuill
            value={description}
            onChange={setDescription}
            className="mb-6 rounded"
            placeholder="Describe your idea in detail."
          />
          <div className="mb-6">
            <label className="block font-bold mb-2">Attachments</label>
            <div
              {...getRootProps()}
              className="w-full h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
              <input {...getInputProps()} />
              <p>Drag files here or click to upload</p>
            </div>
            {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
            {media.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {media.map((item, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={item.url || item.preview}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover rounded shadow"
                    />
                    <button
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full p-1"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;

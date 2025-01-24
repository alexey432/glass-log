import React, { useState, useRef } from "react";
import { FiX } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import axios from "axios"; // Import Axios for making requests

interface AddCardModalProps {
  onClose: () => void;
  onAdd: (name: string, description: string, media: string[]) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false); // For upload status
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload to the backend
  const uploadFiles = async (files: File[]) => {
    const uploadedMedia: string[] = [];
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Add the uploaded file path to the list
        uploadedMedia.push(response.data.filePath);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload some files. Please try again.");
    } finally {
      setUploading(false);
    }

    return uploadedMedia;
  };

  // Handle drop event for media files
  const onDrop = async (acceptedFiles: File[]) => {
    const uploadedMedia = await uploadFiles(acceptedFiles);
    setMedia((prev) => [...prev, ...uploadedMedia]);
  };

  // Handle paste event for images
  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (event.clipboardData.files.length > 0) {
      const files = Array.from(event.clipboardData.files);
      const uploadedMedia = await uploadFiles(files);
      setMedia((prev) => [...prev, ...uploadedMedia]);
    }
  };

  // Handle media removal
  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      alert("Please fill out both fields.");
      return;
    }
    onAdd(name, description, media);
    onClose();
  };

  // Setup for Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"] },
    multiple: true,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full"
        onPaste={handlePaste} // Handle paste events
      >
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">Создать новую идею</h2>

        {/* Scrollable Content */}
        <div className="max-h-[60vh] overflow-y-auto pr-4 scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200">
          {/* Card Name Input */}
          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded focus:ring focus:ring-blue-500"
          />

          {/* Rich Text Editor */}
          <div className="mb-6">
            <label className="block font-bold mb-2">Card Description</label>
            <ReactQuill
              value={description}
              onChange={setDescription}
              className="rounded"
              placeholder="Опишите свою идею/кейс подробнее, при необходимости, приложите картинку."
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "bullet",
                "link",
                "image",
              ]}
            />
          </div>

          {/* Drag-and-Drop Media Area */}
          <div className="mb-6">
            <label className="block font-bold mb-2">Приложения</label>
            <div
              {...getRootProps()}
              className="w-full h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
              <input {...getInputProps()} />
              <p>Перетащите файлы сюда или нажмите, чтобы выбрать</p>
            </div>
            {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
            {media.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {media.map((url, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={url}
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;

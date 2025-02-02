import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchKeys } from "../api/keysApi"; // Import the fetchKeys function

const HomePage: React.FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(""); // For error message display
  const [keys, setKeys] = useState<{ key: string }[]>([]); // State to store keys from the backend
  const navigate = useNavigate();

  // Fetch keys from the backend on component mount
  useEffect(() => {
    const fetchAllKeys = async () => {
      try {
        const keysData = await fetchKeys();
        setKeys(keysData); // Assuming keysData is an array of key objects
      } catch (error) {
        console.error("Error fetching keys:", error);
        setError("Не удалось загрузить ключи. Попробуйте позже.");
      }
    };

    fetchAllKeys();
  }, []);

  const handleExploreInitiatives = () => {
    // Navigate to MainPage with MemberState = false
    navigate("/main", { state: { MemberState: false } });
  };

  const handleCodeSubmit = () => {
    if (!code) {
      setError("Пожалуйста, введите ключ участника.");
      return;
    }

    const isValidKey = keys.some((keyObj) => keyObj.key === code); // Check if the entered key exists in the keys array

    if (isValidKey) {
      // Navigate to MainPage with MemberState = true
      navigate("/main", { state: { MemberState: true } });
    } else {
      setError("Ключ участника неверный. Попробуйте снова.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/background.svg')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <img
            src="/src/assets/logo.svg"
            alt="Company Logo"
            className="w-24 h-auto"
          />
        </div>

        {/* Welcome Section */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Добро пожаловать в GlassLog!
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Присоединяйтесь к нашей платформе для голосования за инициативы и
          предложений для развития продукта.
        </p>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          {/* Explore Initiatives Button */}
          <button
            onClick={handleExploreInitiatives}
            style={{ backgroundColor: "rgb(123, 104, 238)", color: "white" }}
            className="w-full px-6 py-3 text-white font-semibold rounded-md hover:bg-blue-500 transition"
          >
            К инициативам
          </button>

          {/* Enter Code Section */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Ключ участника"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(""); // Clear error when user starts typing
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={handleCodeSubmit}
              style={{
                backgroundColor: "rgb(129, 129, 129)",
                color: "white",
              }}
              className="w-full px-6 py-3 bg-green-400 text-white font-semibold rounded-md hover:bg-green-500 transition"
            >
              Войти как участник
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

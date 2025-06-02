import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheck } from "react-icons/md";

const tones = {
  "Alert tones": [
    "None",
    "Note (Default)",
    "Aurora",
    "Bamboo",
    "Chord",
    "Circles",
    "Complete",
    "Hello",
    "Input",
    "Keys",
    "Popcorn",
    "Pulse",
    "Synth",
  ],
  Classic: [
    "Bell",
    "Boing",
    "Glass",
    "Harp",
    "Ping",
    "Piano",
    "Siren",
    "Swoosh",
    "Time passing",
    "Tri-tone",
    "Tada",
    "Whistle",
    "Xylophone",
  ],
};

export default function NotificationSound() {
  const navigate = useNavigate();
  const [selectedTone, setSelectedTone] = useState("Note (Default)");
  const audioRef = useRef(null);

  useEffect(() => {
    const savedTone = localStorage.getItem("selectedTone");
    if (savedTone) {
      setSelectedTone(savedTone);
    }
  }, []);

  const handleSave = async () => {
    try {
      await fetch("http://localhost:8000/api/save-tone", {
        method: "POST",
        body: JSON.stringify({ tone: selectedTone }),
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("selectedTone", selectedTone);
      navigate(-1); // Go back to notifications page
    } catch (error) {
      console.error("Failed to save tone:", error);
    }
  };

  const playTone = (tone) => {
    if (tone === "None") return;

    const audioPath = `/assets/sounds/${tone}.mp3`;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(audioPath);
    audioRef.current.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300 dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="text-blue-500">
          Cancel
        </button>
        <h2 className="text-lg font-bold">Sound</h2>
        <button onClick={handleSave} className="text-blue-500">
          Save
        </button>
      </div>

      {/* Tone Sections */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(tones).map(([section, items]) => (
          <div key={section}>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm px-4 py-2">
              {section}
            </h3>
            <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg mx-2">
              {items.map((tone) => (
                <div
                  key={tone}
                  onClick={() => {
                    setSelectedTone(tone);
                    playTone(tone);
                  }}
                  className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-neutral-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700"
                >
                  <span>{tone}</span>
                  {selectedTone === tone && (
                    <MdCheck className="text-green-500 text-xl" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

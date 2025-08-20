import React, { useState, useMemo, useEffect } from "react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function StoryModal({ currentUser, onClose, onStoryUpload }) {
  const [storyText, setStoryText] = useState("");
  const [storyFile, setStoryFile] = useState(null);
  const [bgColor, setBgColor] = useState("#1E1E1E");

  const previewUrl = useMemo(() => {
    if (!storyFile) return null;
    return URL.createObjectURL(storyFile);
  }, [storyFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleUpload = async () => {
    if (!storyText && !storyFile) return;

    // For demo: store only the file name, and instruct user to copy file to public/Uploads/
    let fileName = null;
    if (storyFile) {
      fileName = storyFile.name;
      // In a real app, upload the file to a server or cloud storage and get a public URL
      // For demo, user must manually copy the file to public/Uploads/
      alert(`Please copy your file (${fileName}) to the public/Uploads/ folder for it to be accessible.`);
    }

    const newStory = {
      userId: currentUser?.id,
      text: storyText,
      file: fileName ? `/Uploads/${fileName}` : null,
      bgColor: !storyFile ? bgColor : null,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24h
    };
    console.log("StoryModal posting story:", newStory); // Debug log
    try {
      await fetch("http://localhost:8000/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStory),
      });
      onClose();
      onStoryUpload?.();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      {/* Close button */}
      <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-60 rounded-full p-1">
        <XMarkIcon
        className="w-6 h-6 cursor-pointer text-white"
        onClick={onClose}
        />
      </div>
      {/* Story preview */}
      <div className="flex-grow flex items-center justify-center relative w-full h-full">
        {storyFile ? (
          <>
            {storyFile.type.startsWith("image") ? (
              <img
                src={previewUrl}
                className="w-full h-full object-contain"
                alt="Preview"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-contain"
              />
            )}
            {/* Overlay text */}
            {storyText && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black bg-opacity-50 text-white text-lg rounded max-w-[90%] text-center pointer-events-none">
                {storyText}
              </div>
            )}

            {/* Input box for text entry */}
            <input
              type="text"
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Type your story text..."
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] p-2 rounded bg-black bg-opacity-70 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-3xl font-semibold"
            style={{ backgroundColor: bgColor }}
          >
            {storyText}
          </div>
        )}
      </div>
      {/* Input & Options */}
      <div className="p-4 bg-black">
        {!storyFile && (
          <div className="flex justify-center gap-2 mb-2">
            {["#1E1E1E", "#FF5733", "#4CAF50", "#007BFF", "#F1C40F"].map(
              (color) => (
                <div
                  key={color}
                  onClick={() => setBgColor(color)}
                  className="w-8 h-8 rounded-full cursor-pointer border"
                  style={{
                    backgroundColor: color,
                    borderColor: bgColor === color ? "white" : "transparent",
                  }}
                />
              )
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <label htmlFor="fileInput" className="cursor-pointer">
            <PhotoIcon className="w-10 h-10 text-gray-400" />
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              if (e.target.files.length) setStoryFile(e.target.files[0]);
            }}
            className="hidden"
          />
        </div>

        {!storyFile && (
          <input
            type="text"
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="Type your story..."
            className="w-full mt-3 p-2 rounded text-black"
          />
        )}

        <button
          onClick={handleUpload}
          disabled={!storyText && !storyFile}
          className="w-full mt-4 py-2 bg-blue-600 rounded text-white font-semibold"
        >
          Upload Story
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function StoryPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch(`http://localhost:8000/stories?userId=${userId}`);
        const data = await res.json();
        const now = new Date();
        const validStories = data.filter(
          (story) => new Date(story.expiresAt) > now
        );
        setStories(validStories);
      } catch (err) {
        console.error(err);
      }
    }

    fetchStories();
  }, [userId]);

  useEffect(() => {
    if (!stories.length) return;

    const currentStory = stories[currentIndex];
    if (!currentStory) return;

    if (!currentStory.file || currentStory.file.match(/\.(jpeg|jpg|png|gif)$/i)) {
      timerRef.current = setTimeout(() => {
        if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
        else navigate(-1);
      }, 5000);
    }

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, stories, navigate]);

  const goNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
    else navigate(-1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (stories.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No stories to show.
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center text-white">
      {/* Close */}
      <div className="absolute top-4 left-4 cursor-pointer text-xl" onClick={() => navigate(-1)}>
        × Close
      </div>

      {/* Counter */}
      <div className="absolute top-4 right-4 text-sm opacity-70">
        {currentIndex + 1} / {stories.length}
      </div>

      {/* Story area */}
      <div
        className="relative flex-grow flex items-center justify-center w-full max-w-md p-4 cursor-pointer"
        onClick={goNext}
      >
        {currentStory.file ? (
          currentStory.file.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={currentStory.file}
              autoPlay
              controls={false}
              onEnded={goNext}
              className="max-h-[80vh] max-w-full rounded"
              muted
            />
          ) : (
            <img
              src={currentStory.file}
              alt="Story"
              className="max-h-[80vh] max-w-full rounded"
            />
          )
        ) : null}

        {/* Centered text */}
        {currentStory.text && (
          <div className="absolute text-center px-6 text-lg font-medium text-white">
            {currentStory.text}
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between w-full max-w-md px-4 pb-6 text-2xl select-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          disabled={currentIndex === 0}
        >
          ‹ Prev
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}

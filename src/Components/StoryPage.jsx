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

  const fileExt = currentStory.file?.split(".").pop()?.toLowerCase();
  const isImage = !currentStory.file || ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt);

  if (isImage) {
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
      {/* Story area */}
      <div
  className="relative flex-grow flex items-center justify-center w-full h-full cursor-pointer rounded"
  onClick={goNext}
  style={{
    backgroundColor: !currentStory.file ? (currentStory.bgColor || "#000000") : undefined,
  }}
>
  <div className="relative w-full h-full flex justify-center items-center">
    {currentStory.file ? (
      currentStory.file.match(/\.(mp4|webm|ogg)$/i) ? (
        <video
          src={currentStory.file}
          autoPlay
          controls={false}
          onEnded={goNext}
          className="h-full w-full object-contain rounded"
          muted
        />
      ) : (
        <img
          src={currentStory.file}
          alt="Story"
          className="h-full w-full object-contain rounded"
        />
      )
    ) : null}

    {/* Text positioned accordingly */}
    {currentStory.text && (
      <div
        className={`absolute px-6 text-lg font-medium text-white text-center w-full ${
          currentStory.file ? "bottom-6" : "top-1/2 transform -translate-y-1/2"
        }`}
      >
        {currentStory.text}
      </div>
    )}
  </div>
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

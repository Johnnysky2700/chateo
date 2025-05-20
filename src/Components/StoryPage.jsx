import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function StoryPage() {
  const { userId } = useParams();
  const [allStories, setAllStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const fetchStories = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/stories");
      const data = await res.json();

      // Filter expired stories and only for the selected user (if userId provided)
      const now = new Date();
      const filtered = data.filter((story) => {
        const expiresAt = new Date(story.expiresAt);
        return expiresAt > now && (!userId || story.userId === userId);
      });

      setAllStories(filtered);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    }
  }, [userId]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex < allStories.length) {
        return nextIndex;
      } else {
        navigate(-1); // Go back if no more stories
        return prev;
      }
    });
  }, [allStories.length, navigate]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setTimeout(goNext, 4000);
    return () => clearTimeout(timer);
  }, [goNext, currentIndex]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // swiped left
      goNext();
    } else if (diff < -50) {
      // swiped right
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  if (!allStories.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <p>No stories to show.</p>
      </div>
    );
  }

  const currentStory = allStories[currentIndex];

  return (
    <div
      className="h-screen w-screen bg-black text-white flex items-center justify-center relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-4 left-4 text-sm">
        <button onClick={() => navigate(-1)} className="bg-white text-black px-3 py-1 rounded">
          Back
        </button>
      </div>
  
      <div className="max-w-md w-full h-full flex flex-col items-center justify-center px-4 text-center">
        {currentStory.file && (
          <img
            src={currentStory.file}
            alt="Story media"
            className="max-h-[60vh] object-contain mb-4 rounded-lg"
          />
        )}
        {currentStory.text && (
          <p className="text-xl font-medium">{currentStory.text}</p>
        )}
      </div>
  
      {/* Manual navigation buttons */}
      <div className="absolute bottom-6 right-4 flex gap-2">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          className="bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Prev
        </button>
        <button
          onClick={goNext}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );  
}

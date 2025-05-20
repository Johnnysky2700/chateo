import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMoreVertical, FiShare2, FiDownload, FiTrash2, FiSend } from "react-icons/fi";

export default function StoryPage() {
  const { userId } = useParams();
  const [allStories, setAllStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const fetchStories = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/stories");
      const data = await res.json();
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
      const next = prev + 1;
      if (next >= allStories.length) {
        navigate("/ChatPage");
        return prev;
      }
      return next;
    });
  }, [allStories.length, navigate]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    const timer = setTimeout(goNext, 4000);
    return () => clearTimeout(timer);
  }, [goNext, currentIndex]);

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
      goNext();
    } else if (diff < -50) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleForward = () => {
    const contactName = prompt("Enter contact name to forward story:");
    if (contactName) {
      console.log(`Story forwarded to ${contactName}`);
      alert(`Story forwarded to ${contactName}`);
    }
  };

  const handleShare = () => {
    if (navigator.share && currentStory.file) {
      navigator
        .share({
          title: "Story",
          text: currentStory.text || "Check out this story!",
          url: currentStory.file,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      alert("Web Share not supported in this browser.");
    }
  };

  const handleSave = () => {
    if (!currentStory.file) return;
    const link = document.createElement("a");
    link.href = currentStory.file;
    link.download = "story";
    link.click();
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8000/stories/${currentStory.id}`, {
        method: "DELETE",
      });
      alert("Story deleted");
      fetchStories();
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to delete story:", err);
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
      {/* Back Button */}
      <div className="absolute top-4 left-4 text-sm">
        <button onClick={() => navigate(-1)} className="bg-white text-black px-3 py-1 rounded">
          Back
        </button>
      </div>

      {/* Menu Icon */}
      <div className="absolute top-4 right-4 text-white">
        <button onClick={() => setShowMenu(!showMenu)}>
          <FiMoreVertical className="text-2xl" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-10">
            <button
              onClick={handleForward}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <FiSend className="text-gray-600" /> Forward
            </button>
            <button
              onClick={handleShare}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <FiShare2 className="text-gray-600" /> Share
            </button>
            <button
              onClick={handleSave}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <FiDownload className="text-gray-600" /> Save
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              <FiTrash2 className="text-red-600" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Story Content */}
      <div className="max-w-md w-full h-full flex flex-col items-center justify-center px-4 text-center">
        {currentStory.file && (
          <img
            src={currentStory.file}
            alt="Story"
            className="max-h-[60vh] object-contain mb-4 rounded-lg"
          />
        )}
        {currentStory.text && (
          <p className="text-xl font-medium">{currentStory.text}</p>
        )}
      </div>

      {/* Navigation Buttons (for larger screens) */}
      <div className="absolute bottom-6 right-4 hidden sm:flex gap-2">
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

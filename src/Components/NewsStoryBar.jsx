import { useState, useEffect } from "react";

export default function StoryBar({ onSelectStory }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("https://chat-backend-chi-virid.vercel.app/api/stories");
        const data = await res.json();
        setStories(data.filter(story => Date.now() - new Date(story.timestamp) < 24 * 60 * 60 * 1000));
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="flex overflow-x-auto gap-4 p-4 bg-white dark:bg-black">
      {stories.map(story => (
        <div key={story.id} className="flex-shrink-0 text-center" onClick={() => onSelectStory(story)}>
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
            <img src={story.thumbnail} alt="Story thumbnail" className="w-full h-full object-cover" />
          </div>
          <p className="mt-1 text-xs text-black dark:text-white">{story.userName}</p>
        </div>
      ))}
    </div>
  );
}

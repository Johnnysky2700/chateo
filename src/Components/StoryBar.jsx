import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function StoryBar({ currentUser, contacts, setShowFullModal, stories }) {
  const navigate = useNavigate();

  // Group and get latest story per user using passed stories prop
  const latestStoryByUser = contacts
    .map((contact) => {
      const userStories = stories.filter(
        (s) =>
          s.userId?.toString() === contact.id?.toString() ||
          s.contactId?.toString() === contact.id?.toString()
      );
      if (!userStories.length) return null;

      const latest = userStories.reduce((a, b) =>
        new Date(a.createdAt) > new Date(b.createdAt) ? a : b
      );

      return { ...latest, contact };
    })
    .filter(Boolean);

  return (
    <div className="flex space-x-4 overflow-x-auto py-3 px-1 mb-4">
      {/* Current user's "Add Story" */}
      <div
        onClick={() => setShowFullModal(true)}
        className="flex flex-col items-center cursor-pointer"
      >
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt="you"
            className="w-14 h-14 rounded-2xl border-2 border-green-500 object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-green-500 text-white flex items-center justify-center font-bold">
            +
          </div>
        )}
        <p className="text-xs mt-1">Your Story</p>
      </div>

      {/* Contacts' latest stories */}
      {latestStoryByUser.map((story) => (
        <div
          key={story.id}
          onClick={() => navigate(`/story/${story.contact.id}`)}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="relative">
            {story.file && story.file.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={story.file}
                className="w-14 h-14 object-cover rounded-2xl border-2 border-blue-500"
                muted
              />
            ) : (
              <img
                src={story.file || story.contact.avatar}
                alt={story.contact.name}
                className="w-14 h-14 object-cover rounded-2xl border-2 border-blue-500"
              />
            )}
            <span className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-[10px] px-1 rounded">
              {formatDistanceToNow(new Date(story.createdAt), { addSuffix: false })}
            </span>
          </div>
          <p className="text-xs mt-1 truncate w-16 text-center select-none">
            {story.contact.name.split(" ")[0]}
          </p>
        </div>
      ))}
    </div>
  );
}

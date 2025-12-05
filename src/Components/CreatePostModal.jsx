import { useState } from "react";

export default function CreatePostModal({ onClose, onPost }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [taggedUsers, setTaggedUsers] = useState("");
  const [preview, setPreview] = useState(null);

  const handlePost = async () => {
    if (!file) return;

    const newPost = {
      username: "CurrentUser", // Replace with dynamic user data
      userAvatar: "/default-avatar.png", // Replace with real avatar
      caption,
      location,
      tagged: taggedUsers.split(",").map(t => t.trim()),
      mediaUrl: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      saved: false
    };

    try {
      const res = await fetch("https://chateo-zeta.vercel.app/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (res.ok) {
        const savedPost = await res.json();
        onPost(savedPost);
        onClose();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-80 p-4 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500 text-xl">✕</button>
        <h2 className="text-lg font-bold mb-4">Create Post</h2>

        {/* Media Preview */}
        {preview && (
          <div className="mb-3">
            {file?.type?.startsWith("video") ? (
              <video src={preview} controls className="w-full rounded" />
            ) : (
              <img src={preview} alt="Preview" className="w-full rounded" />
            )}
          </div>
        )}

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-2"
          placeholder="Write a caption..."
        />

        <input
          type="text"
          value={taggedUsers}
          onChange={(e) => setTaggedUsers(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-2"
          placeholder="Tag people (e.g. @john, @jane)"
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-4"
          placeholder="Add location"
        />

        <button
          onClick={handlePost}
          className="bg-blue-500 text-white px-3 py-2 rounded w-full"
          disabled={!file}
        >
          Post
        </button>
      </div>
    </div>
  );
}

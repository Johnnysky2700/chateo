import { useState } from "react";
import { useEffect } from "react";

export default function CommentModal({ postId, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:8000/comments?postId=${postId}`);
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      postId,
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:8000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });

      if (res.ok) {
        setComments(prev => [...prev, comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-80 p-4 rounded shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500">✕</button>
        <h2 className="text-lg font-bold mb-4">Comments</h2>
        <div className="overflow-y-auto max-h-48 mb-4">
          {comments.map((comment, index) => (
            <div key={index} className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {comment.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-2"
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment} className="bg-blue-500 text-white px-3 py-1 rounded">
          Post
        </button>
      </div>
    </div>
  );
}

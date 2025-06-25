import { useEffect, useState, useRef } from "react";
import { FaRegSmile, FaEdit, FaTrash, FaReply } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function CommentModal({ post, onClose, navigateToUserProfile }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`http://localhost:8000/comments?postId=${post.id}`);
      const data = await res.json();
      setComments(data);
    };
    fetchComments();

    const fetchUsers = async () => {
      const res = await fetch("http://localhost:8000/users");
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, [post.id]);

  const handleAddOrUpdateComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      postId: post.id,
      userId: 1, // Replace with dynamic user ID
      text: newComment,
      timestamp: new Date().toISOString(),
      parentId: replyTo?.id || null, // Reply logic
    };

    if (editingCommentId) {
      await fetch(`http://localhost:8000/comments/${editingCommentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === editingCommentId ? { ...c, text: newComment } : c
        )
      );
      setEditingCommentId(null);
    } else {
      const res = await fetch("http://localhost:8000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });
      const saved = await res.json();
      setComments((prev) => [...prev, saved]);
    }

    setNewComment("");
    setReplyTo(null);
    setEmojiPickerVisible(false);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8000/comments/${id}`, {
      method: "DELETE",
    });
    setComments((prev) => prev.filter((c) => c.id !== id && c.parentId !== id)); // Remove replies too
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    inputRef.current.focus();
  };

  const handleEmojiSelect = (emoji) => {
    setNewComment((prev) => prev + emoji.native);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setNewComment(val);

    const match = val.match(/@(\w+)$/);
    if (match) {
      const search = match[1].toLowerCase();
      const matched = users.filter((user) =>
        `${user.firstName}${user.lastName}`.toLowerCase().includes(search)
      );
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };

  const handleTagClick = (user) => {
    const tag = `@${user.firstName}${user.lastName}`;
    const updated = newComment.replace(/@\w*$/, tag + " ");
    setNewComment(updated);
    setSuggestions([]);
    inputRef.current.focus();
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return date.toLocaleString();
  };

  const renderComments = (parentId = null) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((comment) => (
        <div key={comment.id} className="ml-4 mb-2">
          <div className="flex items-start gap-2">
            <img
              src={comment.avatar || "/default-avatar.png"}
              className="w-6 h-6 rounded-full"
              alt="avatar"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {comment.text.split(/(@\w+)/).map((part, i) =>
                    part.startsWith("@") ? (
                      <span
                        key={i}
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => navigateToUserProfile(part.substring(1))} // Clickable mention
                      >
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <div className="flex gap-2 mt-1 text-xs text-gray-500">
                <button onClick={() => handleReply(comment)}>
                  <FaReply />
                </button>
                <button
                  onClick={() => {
                    setNewComment(comment.text);
                    setEditingCommentId(comment.id);
                    inputRef.current.focus();
                  }}
                >
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(comment.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
          {renderComments(comment.id)} {/* Recursive rendering */}
        </div>
      ));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-96 p-4 rounded shadow-lg relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-xl"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">Comments</h2>

        <div className="mb-4 space-y-3">{renderComments()}</div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-700 shadow absolute z-50 rounded p-2 w-full max-w-[350px] mb-1">
            {suggestions.map((user) => (
              <div
                key={user.id}
                className="cursor-pointer px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                onClick={() => handleTagClick(user)}
              >
                @{user.firstName}{user.lastName}
              </div>
            ))}
          </div>
        )}

        {/* Input and emoji */}
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border rounded"
            placeholder={
              replyTo
                ? `Replying to ${replyTo.text.slice(0, 15)}...`
                : "Write a comment..."
            }
          />
          <FaRegSmile
            onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
            className="text-xl cursor-pointer"
          />
        </div>

        {emojiPickerVisible && (
          <div className="absolute bottom-16 right-4 z-50">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}

        <button
          onClick={handleAddOrUpdateComment}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded w-full"
        >
          {editingCommentId ? "Update" : "Post"}
        </button>
      </div>
    </div>
  );
}

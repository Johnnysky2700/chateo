import { useEffect, useState, useRef, useCallback } from "react";
import StoryBar from "./NewsStoryBar";
import CommentModal from "./CommentModal";
import CreatePostModal from "./CreatePostModal";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineSave,
  AiFillSave,
} from "react-icons/ai";
import { FiPlus } from "react-icons/fi";

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const containerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [userFilter, setUserFilter] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      let url = `http://localhost:8000/posts?_page=${page}&_limit=5`;
      if (userFilter) {
        url += `&userId=${userFilter}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        setPosts((prev) => [...prev, ...data]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }, [page, userFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleDoubleTap = async (postId) => {
    if (!likedPosts.includes(postId)) {
      setLikedPosts([...likedPosts, postId]);
      await fetch(`http://localhost:8000/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: true }),
      });
    }
  };

  const toggleSave = async (postId) => {
    const isSaved = savedPosts.includes(postId);
    const updated = isSaved
      ? savedPosts.filter((id) => id !== postId)
      : [...savedPosts, postId];

    setSavedPosts(updated);
    await fetch(`http://localhost:8000/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saved: !isSaved }),
    });
  };

  const handleCommentClick = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const renderMedia = (post) => {
    if (post.type === "video") {
      return (
        <video
          src={post.mediaUrl}
          className="w-full rounded-lg"
          controls
          autoPlay
          muted
          loop
        />
      );
    }
    return <img src={post.mediaUrl} alt="post" className="w-full rounded-lg" />;
  };

  const handleFilterByUser = (userId) => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setUserFilter(userId);
  };

  return (
    <div
      className="h-screen overflow-y-auto bg-white dark:bg-black"
      ref={containerRef}
    >
      {/* Stories */}
      <div className="p-3 border-b dark:border-gray-700">
        <StoryBar />
      </div>

      {/* Create Post Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowCreatePost(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-md"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {/* Posts */}
      <div className="p-4 space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm"
            onDoubleClick={() => handleDoubleTap(post.id)}
          >
            {/* User Info */}
            <div className="flex items-center gap-2 mb-2 cursor-pointer">
              <img
                src={post.userAvatar || "/default-avatar.png"}
                className="w-8 h-8 rounded-full"
                alt="avatar"
              />
              <span
                onClick={() => handleFilterByUser(post.userId)}
                className="font-semibold dark:text-white hover:underline"
              >
                {post.username}
              </span>
            </div>

            {/* Media */}
            {renderMedia(post)}

            {/* Actions */}
            <div className="flex items-center justify-between mt-2 text-xl">
              <div className="flex gap-4">
                {likedPosts.includes(post.id) ? (
                  <AiFillHeart className="text-red-500" />
                ) : (
                  <AiOutlineHeart
                    className="cursor-pointer"
                    onClick={() => handleDoubleTap(post.id)}
                  />
                )}
                <AiOutlineComment
                  className="cursor-pointer"
                  onClick={() => handleCommentClick(post)}
                />
              </div>
              <div>
                {savedPosts.includes(post.id) ? (
                  <AiFillSave
                    className="cursor-pointer"
                    onClick={() => toggleSave(post.id)}
                  />
                ) : (
                  <AiOutlineSave
                    className="cursor-pointer"
                    onClick={() => toggleSave(post.id)}
                  />
                )}
              </div>
            </div>

            {/* Caption */}
            {post.caption && (
              <p className="mt-2 text-sm dark:text-gray-300">{post.caption}</p>
            )}
          </div>
        ))}

        {!hasMore && (
          <div className="text-center text-gray-400 dark:text-gray-600 text-sm mt-8">
            No more posts
          </div>
        )}
      </div>

      {/* Modals */}
      {showCommentModal && (
        <CommentModal
          post={selectedPost}
          onClose={() => setShowCommentModal(false)}
        />
      )}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPost={(newPost) => setPosts((prev) => [newPost, ...prev])}
        />
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { MdChevronLeft } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import AttachmentMenu from "./AttachmentMenu";
import PollModal from "./PollModal";
import EventModal from "./EventModal";

export default function ChatDetails() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [contact, setContact] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleMenuAction = async (action) => {
    if (action === "delete") {
      if (selectedMessages.length === 0) {
        setSelectMode(true); // Enable selection mode
        return;
      }

      if (!window.confirm(`Delete ${selectedMessages.length} message(s)?`))
        return;

      try {
        await Promise.all(
          selectedMessages.map((msgId) =>
            fetch(`http://localhost:8000/messages/${msgId}`, {
              method: "DELETE",
            })
          )
        );
        setMessages((prev) =>
          prev.filter((msg) => !selectedMessages.includes(msg.id))
        );
        setFilteredMessages((prev) =>
          prev.filter((msg) => !selectedMessages.includes(msg.id))
        );
        setSelectedMessages([]);
        setSelectMode(false);
        setShowMenu(false);
      } catch (err) {
        console.error("Error deleting messages:", err);
      }
    } else if (action === "block") {
      alert("User blocked (mock)");
    } else if (action === "mute") {
      alert("User muted (mock)");
    }
  };

  const handleFileInput = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      type === "photos"
        ? "image/*"
        : type === "document"
        ? ".pdf,.doc,.docx"
        : "";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setAttachmentPreview({
          type: type === "photos" ? "image" : "document",
          file,
          url,
        });
      }
    };

    input.click();
  };

  const handleCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setAttachmentPreview({
          type: "image",
          file,
          url,
        });
      }
    };

    input.click();
  };
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:8000/messages`);
        const data = await res.json();
        const filtered = data.filter(
          (msg) => String(msg.contactId) === String(id)
        );
        setMessages(filtered);
        setFilteredMessages(filtered);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [id]);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(`http://localhost:8000/contacts/${id}`);
        const data = await res.json();
        setContact(data);
      } catch (error) {
        console.error("Failed to fetch contact:", error);
      }
    };
    fetchContact();
  }, [id]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const filtered = messages.filter((msg) =>
        msg.text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchTerm, messages]);

  const handleSendMessage = async () => {
    if (!message.trim() && !attachmentPreview) return;

    const newMessage = {
      sender: "you",
      text: message,
      timestamp: new Date().toISOString(),
      contactId: id,
      type: attachmentPreview?.type || "text",
      attachmentUrl: attachmentPreview?.url || null,
      attachmentName: attachmentPreview?.file?.name || null,
    };

    try {
      const res = await fetch(`http://localhost:8000/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) throw new Error("Message not saved");

      await fetch(`http://localhost:8000/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastMessage: newMessage.text || "📎 Attachment",
        }),
      });

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setAttachmentPreview(null);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <MdChevronLeft
            className="text-xl cursor-pointer dark:text-white"
            onClick={() => navigate("/ChatPage")}
          />
          <h2 className="text-base dark:text-white">
            {contact?.name || "Loading..."}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-2xl text-black dark:text-white relative">
          <AiOutlineSearch
            className="cursor-pointer"
            onClick={() => setSearchMode((prev) => !prev)}
          />
          <BiMenu
            onClick={() => setShowMenu((prev) => !prev)}
            className="cursor-pointer"
          />
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border rounded shadow-md w-40 text-sm z-50">
              <button
                onClick={() => handleMenuAction("delete")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {selectMode ? "Delete Selected" : "Delete Chat"}
              </button>
              <button
                onClick={() => handleMenuAction("block")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Block
              </button>
              <button
                onClick={() => handleMenuAction("mute")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Mute
              </button>
            </div>
          )}
        </div>
      </div>
      {selectMode && (
        <button
          className="text-sm text-red-500 border px-2 py-1 rounded"
          onClick={() => {
            setSelectMode(false);
            setSelectedMessages([]);
          }}
        >
          Cancel
        </button>
      )}

      {/* Search Input */}
      {searchMode && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {filteredMessages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${
              msg.sender === "you" ? "justify-end" : "justify-start"
            } relative group`}
          >
            {selectMode && (
              <input
                type="checkbox"
                className="absolute -left-6 top-1"
                checked={selectedMessages.includes(msg.id)}
                onChange={() => {
                  setSelectedMessages((prev) =>
                    prev.includes(msg.id)
                      ? prev.filter((id) => id !== msg.id)
                      : [...prev, msg.id]
                  );
                }}
              />
            )}
            <div className="max-w-[75%]">
              {msg.type === "image" && msg.attachmentUrl ? (
                <img
                  src={msg.attachmentUrl}
                  className="w-full rounded-lg"
                  alt="Attachment"
                />
              ) : msg.type === "document" && msg.attachmentUrl ? (
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-black dark:text-white">
                  📄 {msg.attachmentName}
                </div>
              ) : (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    msg.sender === "you"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              )}
              <div
                className={`text-[10px] mt-1 text-right ${
                  msg.sender === "you" ? "text-white/80" : "text-gray-500"
                }`}
              >
                {msg.timestamp &&
                  new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                {msg.read && " • Read"}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Attachment Preview */}
      {attachmentPreview && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-black dark:text-white">
              Attachment Preview
            </p>
            <button
              className="text-red-500 text-sm"
              onClick={() => setAttachmentPreview(null)}
            >
              Cancel
            </button>
          </div>
          {attachmentPreview.type === "image" && (
            <img
              src={attachmentPreview.url}
              alt="preview"
              className="w-full rounded"
            />
          )}
          {attachmentPreview.type === "document" && (
            <div className="p-2 bg-white dark:bg-neutral-700 text-sm rounded text-black dark:text-white">
              📄 {attachmentPreview.file.name}
            </div>
          )}
        </div>
      )}

      {/* Input Bar + Attachment Menu + Modals */}
      <div className="relative">
        {showAttachmentMenu && (
          <AttachmentMenu
            onSelect={(action) => {
              if (["photos", "document"].includes(action))
                handleFileInput(action);
              if (action === "camera") handleCamera();
              if (action === "poll") setShowPoll(true);
              if (action === "event") setShowEvent(true);
              setShowAttachmentMenu(false);
            }}
            onClose={() => setShowAttachmentMenu(false)}
          />
        )}

        {showPoll && (
          <PollModal
            onClose={() => setShowPoll(false)}
            onSubmit={(data) => {
              console.log("Poll:", data);
              setShowPoll(false);
            }}
          />
        )}
        {showEvent && (
          <EventModal
            onClose={() => setShowEvent(false)}
            onSubmit={(data) => {
              console.log("Event:", data);
              setShowEvent(false);
            }}
          />
        )}

        <div className="flex items-center p-4 border-t bg-white dark:bg-black dark:border-gray-700">
          <FiPlus
            size={20}
            className="mr-3 text-gray-500 cursor-pointer"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            placeholder="Message"
          />
          <button
            onClick={handleSendMessage}
            className="ml-3 text-primary text-2xl"
          >
            <RiSendPlaneFill />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { BsPlayFill } from "react-icons/bs";
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

  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSelectAction = (action) => {
    setShowMenu(false);
    if (action === "poll") setShowPoll(true);
    if (action === "event") setShowEvent(true);
    // Add logic for photos, camera, etc.
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
    if (!message.trim()) return;

    const newMessage = {
      sender: "you",
      text: message,
      timestamp: new Date().toISOString(),
      contactId: id,
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
        body: JSON.stringify({ lastMessage: newMessage.text }),
      });

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleMenuAction = async (action) => {
    setShowMenu(false);
    if (action === "delete") {
      try {
        const res = await fetch(
          `http://localhost:8000/messages?contactId=${id}`
        );
        const data = await res.json();

        await Promise.all(
          data.map((msg) =>
            fetch(`http://localhost:8000/messages/${msg.id}`, {
              method: "DELETE",
            })
          )
        );

        setMessages([]);
        setFilteredMessages([]);
      } catch (err) {
        console.error("Failed to delete messages:", err);
      }
    } else if (action === "block") {
      alert("User blocked (not actually implemented)");
    } else if (action === "mute") {
      alert("User muted (not actually implemented)");
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
                Delete Chat
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

      {/* Search */}
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

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {filteredMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "you" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-[75%]">
              {msg.type === "voice" ? (
                <div className="bg-primary text-white p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BsPlayFill size={24} />
                    <div className="bg-white h-6 w-full rounded">
                      <div className="h-full bg-primary w-[60%]"></div>
                    </div>
                  </div>
                  <div className="text-[10px] mt-1 text-right text-white/80">
                    {msg.timestamp &&
                      new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                    • Read
                  </div>
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
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="relative">
        {showAttachmentMenu && (
          <AttachmentMenu
            onSelect={handleSelectAction}
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
            className="mr-3 text-gray-500"
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

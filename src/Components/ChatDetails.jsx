import { useState, useEffect, useRef } from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { BsPlayFill } from 'react-icons/bs';
import { RiSendPlaneFill } from "react-icons/ri";
import { FiPlus } from 'react-icons/fi';
import { MdChevronLeft } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';

export default function ChatDetails() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [contact, setContact] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:8000/messages?contactId=${id}`);
        const data = await res.json();
        setMessages(data);
        setFilteredMessages(data);
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
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      const filtered = messages.filter((msg) =>
        msg.text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchTerm, messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMsg = {
      contactId: parseInt(id),
      type: 'text',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'you',
      read: true,
    };

    try {
      const res = await fetch('http://localhost:8000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMsg),
      });

      if (res.ok) {
        setMessages((prev) => [...prev, newMsg]);
        setMessage('');
      } else {
        console.error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleMenuAction = async (action) => {
    setShowMenu(false);
    switch (action) {
      case 'delete':
        try {
          const res = await fetch(`http://localhost:8000/messages?contactId=${id}`);
          const data = await res.json();
  
          // Delete all messages individually
          await Promise.all(data.map(msg =>
            fetch(`http://localhost:8000/messages/${msg.id}`, {
              method: 'DELETE',
            })
          ));
  
          setMessages([]);
          setFilteredMessages([]);
        } catch (err) {
          console.error("Failed to delete messages:", err);
        }
        break;
  
      case 'block':
        alert('User blocked (not actually implemented)');
        break;
  
      case 'mute':
        alert('User muted (not actually implemented)');
        break;
  
      default:
        break;
    }
  };  

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <MdChevronLeft className="text-xl cursor-pointer dark:text-white" onClick={() => navigate('/ChatPage')} />
          <h2 className="text-base dark:text-white">{contact?.name || 'Loading...'}</h2>
        </div>
        <div className="flex items-center gap-3 text-2xl text-black dark:text-white relative">
          <AiOutlineSearch
            className='cursor-pointer'
            onClick={() => setSearchMode((prev) => !prev)}
          />
          <BiMenu onClick={() => setShowMenu((prev) => !prev)} className='cursor-pointer' />
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border rounded shadow-md w-40 text-sm z-50">
              <button onClick={() => handleMenuAction('delete')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Delete Chat</button>
              <button onClick={() => handleMenuAction('block')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Block</button>
              <button onClick={() => handleMenuAction('mute')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Mute</button>
            </div>
          )}
        </div>
      </div>

      {/* Search bar */}
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

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {filteredMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[75%]">
              {msg.type === 'text' && (
                <div className={`p-3 rounded-lg text-sm ${msg.sender === 'you' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1 text-right ${msg.sender === 'you' ? 'text-white/80' : 'text-gray-500'}`}>
                    {msg.time} {msg.read && '• Read'}
                  </div>
                </div>
              )}
              {msg.type === 'voice' && (
                <div className="bg-primary text-white p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BsPlayFill size={24} />
                    <div className="bg-white h-6 w-full rounded">
                      <div className="h-full bg-primary w-[60%]"></div>
                    </div>
                  </div>
                  <div className="text-[10px] mt-1 text-right text-white/80">
                    {msg.time} • Read
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="flex items-center p-4 border-t bg-white dark:bg-black">
        <FiPlus size={20} className="mr-3 text-gray-500" />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
          placeholder="Message"
        />
        <button onClick={handleSend} className="ml-3 text-primary text-2xl">
          <RiSendPlaneFill />
        </button>
      </div>
    </div>
  );
}
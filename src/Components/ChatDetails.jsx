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
  const [contact, setContact] = useState(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); // contact ID from route

  // Fetch messages for this contact
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:8000/messages?contactId=${id}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [id]);

  // Fetch contact info
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

  // Scroll to bottom on new message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send message
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
        setMessages(prev => [...prev, newMsg]);
        setMessage('');
      } else {
        console.error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <MdChevronLeft className="text-xl cursor-pointer dark:bg-gray-800 text-black dark:text-white" onClick={() => navigate('/ChatPage')} />
          <h2 className="text-base dark:bg-gray-800 text-black dark:text-white">{contact?.name || 'Loading...'}</h2>
        </div>
        <div className="flex items-center gap-2 text-2xl dark:bg-gray-800 text-black dark:text-white">
          <AiOutlineSearch className='text-lg' />
          <BiMenu />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[75%]">
              {msg.type === 'image' && (
                <div>
                  <img src={msg.src} alt="sent" className="rounded-md mb-1" />
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-gray-400">{msg.time}</p>
                </div>
              )}

              {msg.type === 'text' && (
                <div className={`p-3 rounded-lg text-sm ${msg.sender === 'you' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
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

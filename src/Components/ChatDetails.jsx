import { useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { BsPlayFill } from 'react-icons/bs';
import { FiPlus, FiSend } from 'react-icons/fi';

export default function ChatDetails() {
  const [message, setMessage] = useState('');

  const messages = [
    {
      type: 'image',
      src: '/cat.jpg', // Replace with actual image URL or local asset
      text: 'Look at how chocho sleep in my arms!',
      time: '16.46',
      sender: 'other',
    },
    {
      type: 'text',
      text: 'Can I come over?',
      time: '16.46',
      sender: 'you',
    },
    {
      type: 'text',
      text: "Of course, let me know if you're on your way",
      time: '16.46',
      sender: 'other',
    },
    {
      type: 'text',
      text: "K, I'm on my way",
      time: '16.50',
      sender: 'you',
      read: true,
    },
    {
      type: 'voice',
      duration: '0:20',
      time: '09.13',
      sender: 'you',
      read: true,
    },
    {
      type: 'text',
      text: 'Good morning, did you sleep well?',
      time: '09.45',
      sender: 'other',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <IoMdArrowBack size={24} />
          <h2 className="font-semibold text-lg">Athalia Putri</h2>
        </div>
        <div className="flex items-center gap-4 text-xl">
          <FiSearch />
          <HiOutlineMenuAlt3 />
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
                <div className={`p-3 rounded-lg text-sm ${msg.sender === 'you' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                  {msg.text}
                  <div className="text-[10px] mt-1 text-right text-white/80">
                    {msg.time} {msg.read && '• Read'}
                  </div>
                </div>
              )}

              {msg.type === 'voice' && (
                <div className="bg-blue-600 text-white p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BsPlayFill size={24} />
                    <div className="bg-white h-6 w-full rounded">
                      {/* Simulate waveform */}
                      <div className="h-full bg-blue-600 w-[60%]"></div>
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
      </div>

      {/* Input Bar */}
      <div className="flex items-center p-4 border-t bg-white dark:bg-black">
        <FiPlus size={20} className="mr-3" />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
          placeholder="Message"
        />
        <button className="ml-3 text-blue-500">
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
}

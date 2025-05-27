import React, { useState, useEffect } from "react";
import { MdChevronLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Notification() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    messageShow: true,
    messageReaction: true,
    groupShow: true,
    groupReaction: true,
    statusReaction: true,
    reminders: true,
    clearBadge: true,
  });

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="flex items-center mb-6">
        <MdChevronLeft
          onClick={() => navigate(-1)}
          className="text-3xl cursor-pointer mr-2"
        />
        <h1 className="text-xl font-bold flex-1 text-center -ml-6">Notifications</h1>
      </div>

      {/* Section: Message Notifications */}
      <div className="space-y-4 mb-8">
        <p className="text-gray-400">Message notifications</p>
        <div className="bg-[#1c1c1e] p-4 rounded-lg flex justify-between items-center">
          <span>Show notifications</span>
          <input type="checkbox" checked={settings.messageShow} onChange={() => handleToggle("messageShow")} />
        </div>
        <div className="bg-[#1c1c1e] p-4 rounded-lg">
          <span>Sound</span>
          <span className="block text-right text-green-400">Note</span>
        </div>
        <div className="bg-[#1c1c1e] p-4 rounded-lg flex justify-between items-center">
          <span>Reaction notifications</span>
          <input type="checkbox" checked={settings.messageReaction} onChange={() => handleToggle("messageReaction")} />
        </div>
      </div>

      {/* Section: Group Notifications */}
      <div className="space-y-4 mb-8">
        <p className="text-gray-400">Group notifications</p>
        <div className="bg-[#1c1c1e] p-4 rounded-lg flex justify-between items-center">
          <span>Show notifications</span>
          <input type="checkbox" checked={settings.groupShow} onChange={() => handleToggle("groupShow")} />
        </div>
        <div className="bg-[#1c1c1e] p-4 rounded-lg">
          <span>Sound</span>
          <span className="block text-right text-green-400">Note</span>
        </div>
        <div className="bg-[#1c1c1e] p-4 rounded-lg flex justify-between items-center">
          <span>Reaction notifications</span>
          <input type="checkbox" checked={settings.groupReaction} onChange={() => handleToggle("groupReaction")} />
        </div>
      </div>

      {/* Section: Status Notifications */}
      <div className="space-y-4 mb-8">
        <p className="text-gray-400">Status notifications</p>
        <div className="bg-[#1c1c1e] p-4 rounded-lg">
          <span>Sound</span>
          <span className="block text-right text-green-400">Note</span>
        </div>
        <div className="bg-[#1c1c1e] p-4 rounded-lg flex justify-between items-center">
          <span>Reaction notifications</span>
          <input type="checkbox" checked={settings.statusReaction} onChange={() => handleToggle("statusReaction")} />
        </div>
      </div>

      {/* Section: Reminders */}
      <div className="space-y-2 mb-8">
        <div className="bg-[#1c1c1e] p-4 rounded-lg flex justify-between items-center">
          <span>Reminders</span>
          <input type="checkbox" checked={settings.reminders} onChange={() => handleToggle("reminders")} />
        </div>
        <p className="text-gray-400 text-sm px-1">
          Get occasional reminders about messages or status updates you haven’t seen.
        </p>
      </div>

      {/* Section: Home Screen Notifications */}
      <div className="space-y-2">
        <p className="text-gray-400">Home screen notifications</p>
        <div className="bg-[#1c1c1e] p-4 rounded-lg flex justify-between items-center">
          <div>
            <p>Clear badge</p>
            <p className="text-gray-400 text-sm">Your home screen badge clears completely after every time you open the app.</p>
          </div>
          <input type="checkbox" checked={settings.clearBadge} onChange={() => handleToggle("clearBadge")} />
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Notification() {
  const navigate = useNavigate();

  const [messageNotifications, setMessageNotifications] = useState(true);
  const [messageReactions, setMessageReactions] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [groupReactions, setGroupReactions] = useState(true);
  const [statusReactions, setStatusReactions] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [clearBadge, setClearBadge] = useState(true);

  const handleAction = async (action) => {
    const response = await fetch(
      `https://chateo-ml7k.onrender.com/notifications/${action}`,
      {
        method: "POST",
      }
    );
    if (response.ok) {
      alert(`${action.replace(/-/g, " ")} completed`);
    } else {
      alert("Something went wrong");
    }
  };

  const Toggle = ({ value, onChange }) => (
    <input
      type="checkbox"
      className="w-5 h-5"
      checked={value}
      onChange={() => onChange(!value)}
    />
  );

  const Section = ({ title, children }) => (
    <div className="mb-2">
      {title && (
        <h2 className="text-gray-500 text-sm font-semibold mb-2">{title}</h2>
      )}
      <div className="space-y-3 bg-white dark:bg-neutral-600 p-4 rounded-lg shadow-sm">
        {children}
      </div>
    </div>
  );

  const SoundItem = () => {
    const selectedTone =
      localStorage.getItem("selectedTone") || "Note (Default)";
    return (
      <div
        onClick={() => navigate("/notification-sound")}
        className="flex justify-between items-center cursor-pointer"
      >
        <span className="text-black dark:text-white">Sound</span>
        <span className="text-gray-400">{selectedTone} &gt;</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-300 text-black dark:bg-black dark:text-white p-4 space-y-4">
      <div className="flex items-center mb-6 fixed top-0 left-0 w-full bg-white p-2">
        <MdChevronLeft
          onClick={() => navigate(-1)}
          className="text-3xl cursor-pointer absolute left-0"
        />
        <h1 className="text-xl font-bold w-full text-center">Notifications</h1>
      </div>
      <div className="mt-20 pt-6">
        <Section title="Message notifications">
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white">
              Show notifications
            </span>
            <Toggle
              value={messageNotifications}
              onChange={setMessageNotifications}
            />
          </div>
          <SoundItem />
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white">
              Reaction notifications
            </span>
            <Toggle value={messageReactions} onChange={setMessageReactions} />
          </div>
        </Section>

        <Section title="Group notifications">
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white">
              Show notifications
            </span>
            <Toggle
              value={groupNotifications}
              onChange={setGroupNotifications}
            />
          </div>
          <SoundItem />
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white">
              Reaction notifications
            </span>
            <Toggle value={groupReactions} onChange={setGroupReactions} />
          </div>
        </Section>

        <Section title="Status notifications">
          <SoundItem />
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white">
              Reaction notifications
            </span>
            <Toggle value={statusReactions} onChange={setStatusReactions} />
          </div>
        </Section>

        <Section>
          <div className="flex justify-between items-center">
            <span className="text-black dark:text-white">Reminders</span>
            <Toggle value={reminders} onChange={setReminders} />
          </div>
        </Section>
        <p className="text-gray-500 text-sm">
          Get occasional reminders about messages or status updates you haven’t
          seen.
        </p>

        <Section title="Home screen notifications">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-black dark:text-white">Clear badge</p>
            </div>
            <Toggle value={clearBadge} onChange={setClearBadge} />
          </div>
        </Section>
        <p className="text-gray-500 text-sm">
          Your home screen badge clears completely after every time you open the
          app.
        </p>

        <div className="bg-white dark:bg-neutral-600 p-4 rounded-lg">
          <button
            className="text-red-500"
            onClick={() => handleAction("reset-all")}
          >
            Reset Notification settings
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-12">
          Reset all notification settings, including custom notification
          settings for your chats.
        </p>
      </div>
      <Footer />
    </div>
  );
}

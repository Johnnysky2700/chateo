import React from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import Footer from './Footer';

const Privacy = () => {
  const navigate = useNavigate();

  const navItem = (label, value = "", route) => (
    <div
      onClick={() => route && navigate(route)}
      className="flex justify-between items-center py-4 px-4 border-b border-gray-300 dark:border-gray-700 cursor-pointer bg-white dark:bg-neutral-800"
    >
      <span className="text-black dark:text-white">{label}</span>
      <span className="text-gray-500">{value && `${value} >`}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-black text-black dark:text-white text-sm space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-300 dark:border-gray-700 dark:bg-neutral-800 fixed top-0 left-0 w-full bg-white p-2">
        <MdChevronLeft
          onClick={() => navigate(-1)}
          className="text-3xl absolute left-4 cursor-pointer"
        />
        <h2 className="text-lg font-bold text-center w-full">Privacy</h2>
      </div>

      {/* List */}
      <div className="space-y-4">
        {/* First block */}
        <div className="rounded-lg overflow-hidden mt-16">
          {navItem("Last seen & online", "Nobody", "/privacy/last-seen")}
          {navItem("Profile photo", "Everyone", "/privacy/profile-photo")}
          {navItem("About", "My contacts", "/privacy/about")}
          {navItem("Groups", "Everyone", "/privacy/groups")}
          {navItem("Avatar stickers", "My contacts", "/privacy/avatar-stickers")}
          {navItem("Status", "34 Excluded", "/privacy/status")}
        </div>

        {/* Live location block */}
        <div className="rounded-lg overflow-hidden">
          {navItem("Live location", "None", "/privacy/live-location")}
          <p className="px-4 pt-2 text-gray-500 text-xs">
            List of chats where you are sharing your live location.
          </p>
        </div>

        {/* Calls and Contacts */}
        <div className="rounded-lg overflow-hidden">
          {navItem("Calls", "", "/privacy/calls")}
          {navItem("Contacts", "", "/privacy/contacts")}
        </div>

        {/* Disappearing messages */}
        <div className="rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-100 dark:bg-neutral-700 text-gray-500 text-xs font-semibold">
            Disappearing messages
          </div>
          {navItem("Default message timer", "Off", "/privacy/message-timer")}
          <p className="px-4 pt-2 text-gray-500 text-xs">
            Start new chats with disappearing messages set to your timer.
          </p>
        </div>

        {/* Read receipts */}
        <div className="rounded-lg overflow-hidden bg-white dark:bg-neutral-800">
          <div className="flex justify-between items-center px-4 py-4 border-b border-gray-300 dark:border-gray-700">
            <span className="text-black dark:text-white">Read receipts</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <p className="px-4 py-2 text-gray-500 text-xs">
            If you turn off read receipts, you won't be able to see read receipts from other people.
            Read receipts are always sent for group chats.
          </p>
        </div>

        {/* App Lock */}
        <div className="rounded-lg overflow-hidden">
          {navItem("App lock", "", "/privacy/require-face-id")}
          <p className="px-4 pt-2 text-gray-500 text-xs">
            Require Face ID to unlock.
          </p>
        </div>

        {/* Other Options */}
        <div className="rounded-lg overflow-hidden">
          {navItem("Chat lock", "", "/privacy/chat-lock")}
          {navItem("Advanced", "", "/privacy/advanced")}
          {navItem("Privacy checkup", "", "/privacy/privacy-checkup")}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;

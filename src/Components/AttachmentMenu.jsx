import React from "react";
import { FaCamera, FaImage, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import { MdContactPhone, MdPoll, MdEvent } from "react-icons/md";

const menuItems = [
  { label: "Photos", icon: <FaImage />, action: "photos" },
  { label: "Camera", icon: <FaCamera />, action: "camera" },
  { label: "Location", icon: <FaMapMarkerAlt />, action: "location" },
  { label: "Contact", icon: <MdContactPhone />, action: "contact" },
  { label: "Document", icon: <FaFileAlt />, action: "document" },
  { label: "Poll", icon: <MdPoll />, action: "poll" },
  { label: "Event", icon: <MdEvent />, action: "event" },
];

const AttachmentMenu = ({ onSelect, onClose }) => {
  return (
    <div className="absolute bottom-16 left-4 z-10 p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-xl grid grid-cols-4 gap-4 animate-fadeIn">
      {menuItems.map((item) => (
        <div
          key={item.label}
          onClick={() => onSelect(item.action)}
          className="flex flex-col items-center text-xs text-black dark:text-white hover:opacity-80 cursor-pointer"
        >
          <div className="text-xl mb-1">{item.icon}</div>
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default AttachmentMenu;

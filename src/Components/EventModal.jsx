import React, { useState } from "react";

const EventModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-80 space-y-4">
        <h2 className="text-lg font-bold text-black dark:text-white">Create Event</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 text-black dark:text-white"
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 text-black dark:text-white"
        />
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="text-gray-500 text-sm">Cancel</button>
          <button
            onClick={() => onSubmit({ title, date })}
            className="text-green-600 font-medium text-sm"
          >
            Send Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;

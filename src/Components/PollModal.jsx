import React, { useState } from "react";

const PollModal = ({ onClose, onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const updateOption = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-80 space-y-4">
        <h2 className="text-lg font-bold text-black dark:text-white">Create Poll</h2>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 text-black dark:text-white"
        />
        {options.map((opt, i) => (
          <input
            key={i}
            type="text"
            value={opt}
            onChange={(e) => updateOption(e.target.value, i)}
            placeholder={`Option ${i + 1}`}
            className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 text-black dark:text-white"
          />
        ))}
        <button
          onClick={() => setOptions([...options, ""])}
          className="text-xs text-blue-500"
        >
          + Add Option
        </button>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="text-gray-500 text-sm">Cancel</button>
          <button
            onClick={() => onSubmit({ question, options })}
            className="text-green-600 font-medium text-sm"
          >
            Send Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollModal;

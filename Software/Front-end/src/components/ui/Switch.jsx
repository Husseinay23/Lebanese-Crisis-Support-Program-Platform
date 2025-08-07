// src/components/ui/Switch.jsx

import React from 'react';

const Switch = ({ id, checked, onCheckedChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="hidden"
      />
      <span className={`w-10 h-5 bg-gray-300 rounded-full ${checked ? 'bg-green-600' : ''} transition-colors`} />
      <span className={`w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-transform ${checked ? 'transform translate-x-5' : ''}`} />
    </label>
  );
};

export default Switch;

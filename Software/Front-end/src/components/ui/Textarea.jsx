// src/components/ui/Textarea.jsx

import React from 'react';

const Textarea = ({ id, value, onChange, placeholder = '', className = '' }) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded px-4 py-2 w-full ${className}`}
    />
  );
};

export default Textarea;

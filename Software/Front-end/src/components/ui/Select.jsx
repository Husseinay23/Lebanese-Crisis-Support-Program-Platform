// src/components/ui/Select.jsx

import React from 'react';

const Select = ({ value, onValueChange, children }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border rounded px-4 py-2 w-full"
    >
      {children}
    </select>
  );
};

const SelectContent = ({ children }) => {
  return <div>{children}</div>;
};

const SelectTrigger = ({ children }) => {
  return <div>{children}</div>;
};

const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

const SelectValue = ({ placeholder }) => {
  return <div>{placeholder}</div>;
};

// Named exports
export { Select, SelectContent, SelectTrigger, SelectItem, SelectValue };

// src/components/ui/Slider.jsx

import React from 'react';

const Slider = ({ id, min, max, step, value, onValueChange, className = '' }) => {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
      className={`w-full ${className}`}
    />
  );
};

export default Slider;

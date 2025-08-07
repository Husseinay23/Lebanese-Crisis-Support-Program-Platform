



import React from "react";

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ModalHeader({ children }) {
  return <div className="border-b pb-2 mb-4 text-lg font-bold">{children}</div>;
}

export function ModalBody({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function ModalFooter({ children }) {
  return <div className="border-t pt-4">{children}</div>;
}

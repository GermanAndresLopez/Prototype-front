import React from 'react';

export const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <span className="notification-message">{message}</span>
      {onClose && (
        <button className="notification-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

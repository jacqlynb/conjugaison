import React from 'react';
import './Tag.css';

export function RemoveTag({ handleClick }) {
  return (
    <button
      type="button"
      className="custom-verb__rmv-btn"
      onClick={handleClick}
    >
      x
    </button>
  );
}

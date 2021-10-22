import React from 'react';
import './Tag.css';

export function AddTag({ handleAddClick }) {
  return (
    <button
      value="Add"
      className="custom-verb__add-btn"
      onClick={handleAddClick}
    >
      Add
    </button>
  );
}

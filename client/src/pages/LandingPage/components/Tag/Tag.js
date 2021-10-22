import React from 'react';
import { RemoveTag } from './RemoveTag';
import './Tag.css';

export function Tag({ verb, onRemove }) {
  function handleClick(event) {
    event.preventDefault();
    onRemove(verb);
  }

  return (
    <div id={verb} className="custom-verb__tag">
      <span>{verb}</span>
      <RemoveTag id={verb} handleClick={handleClick} />
    </div>
  );
}

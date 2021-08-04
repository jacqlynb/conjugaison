import React from 'react';
import './NumberOfPromptsForm.css';

export function NumberOfPromptsForm(props) {
  return (
    <div className="number-of-prompts">
      <label className="number-of-prompts__label">Nombre à pratiquer: </label>
      <input
        className="number-of-prompts__input"
        type="text"
        value={props.numPrompts === 0 ? '' : props.numPrompts}
        onChange={props.onSelectNumPrompts}
      />
    </div>
  );
}

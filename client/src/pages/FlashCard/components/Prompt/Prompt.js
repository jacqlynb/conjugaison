import React from 'react';
import './Prompt.css';

export function Prompt({ currentTense, infinitive }) {
  return (
    <div className="prompt">
      <p className="current-tense">{currentTense}</p>
      <span className="infinitive">
        {infinitive == null ? <span>&nbsp;</span> : ` (${infinitive})`}
      </span>
    </div>
  );
}

import React from 'react';
import './Prompt.css';

export function Prompt({ currentTense, infinitive, children }) {
  return (
    <div className="prompt">
      <div className="prompt__current-tense">{currentTense}</div>
      {children}
      <div className="prompt__infinitive">
        {infinitive == null ? <span>&nbsp;</span> : ` (${infinitive})`}
      </div>
    </div>
  );
}

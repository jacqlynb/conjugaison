import React from 'react';
import './Prompt.css';

export function Prompt(props) {
  return (
    <div className="prompt">
      <p className="current-tense">{props.currentTense}</p>
      <span className="infinitive">
        {props.infinitive === '' 
          ? <span>&nbsp;</span> 
          : ` (${props.infinitive})`}
      </span>
    </div>
  )
}
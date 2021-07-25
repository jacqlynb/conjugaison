import React from 'react';
import './NumberOfPromptsForm.css';

export function NumberOfPromptsForm(props) {
  
    return (
        <div className="number-of-prompts">
            <label>Number to practice</label>
            <input type="number" onChange={props.onSelectNumPrompts}/>
        </div>
    );
  };
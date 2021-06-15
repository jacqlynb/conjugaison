import React from 'react';
import './VerbGroupForm.css';

export function VerbGroupForm(props) {
  const verbGroups = ['er', 'ir', 'irregular-ir', 'irregular-re', 'irregular-oir'];
  const verbGroupMarkup = verbGroups.map(verbGroup => {
    return (
      <div key={verbGroup}>
        <input type="radio"
               id={verbGroup}
               name="verb-group"
               value={verbGroup}
               checked={(props.verbGroup === verbGroup) ? true : false}
               onChange={props.onSelect} />
        <label htmlFor={verbGroup}>
            {verbGroup.includes('irregular')
              ? verbGroup.replace('irregular-', 'irrégulier « ') + ' »'
              : '« ' + verbGroup + ' »'}
        </label>
      </div>
    );
  });

  return (
    <div className="verb-group-form">
    <h4>Group:</h4>
    {verbGroupMarkup}
    </div>
  );
};
import React from 'react';
import { CustomVerbForm } from '../CustomVerbForm';
import './VerbGroupForm.css';

export function VerbGroupForm({
  verbGroup,
  customVerbs,
  removeCustomVerbs,
  removeCustomVerb,
  onSelectGroup,
  handleCustomVerbChange,
  handleFocus,
  handleBlur,
  focused,
}) {
  const verbGroups = [
    'er',
    'ir',
    'irregular-ir',
    'irregular-re',
    'irregular-oir',
    'custom-verb-list',
  ];

  const verbGroupMarkup = verbGroups.map((group) => {
    return (
      <div className="verb-group-form__radio" key={group}>
        <input
          type="radio"
          id={group}
          name="verb-group"
          value={group}
          checked={verbGroup === group ? true : false}
          onChange={onSelectGroup}
        />
        <label htmlFor={group}>
          {group === 'custom-verb-list'
            ? 'custom verb list'
            : group.includes('irregular')
            ? group.replace('irregular-', 'irrégulier « ') + ' »'
            : '« ' + group + ' »'}
        </label>
      </div>
    );
  });

  return (
    <>
      <div className="verb-group-form">
        <h4 className="verb-group-form__heading">Group:</h4>
        <div className="verb-group-form__radio-wrapper">{verbGroupMarkup}</div>
      </div>
      <CustomVerbForm
        verbGroup={verbGroup}
        customVerbs={customVerbs}
        handleCustomVerbChange={handleCustomVerbChange}
        removeCustomVerb={removeCustomVerb}
        removeCustomVerbs={removeCustomVerbs}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        focused={focused}
      />
    </>
  );
}

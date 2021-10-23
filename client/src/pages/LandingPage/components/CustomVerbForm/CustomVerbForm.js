import React, { useState } from 'react';
import { Tag, AddTag } from '../Tag';
import './CustomVerbForm.css';

export function CustomVerbForm({
  verbGroup,
  customVerbs,
  handleCustomVerbChange,
  removeCustomVerb,
  removeCustomVerbs,
  handleFocus,
  handleBlur,
}) {
  const [currentCustomVerb, setCurrentCustomVerb] = useState('');

  function handleChange(event) {
    event.preventDefault();
    setCurrentCustomVerb(event.target.value);
  }

  function handleAddClick(event) {
    event.preventDefault();
    addCustomVerb(currentCustomVerb);
    setCurrentCustomVerb('');
  }

  async function addCustomVerb(verb) {
    const response = await fetch('/api/verbs/' + verb);
    if (response.status !== 200) {
      return;
    }
    const body = await response.json();
    handleCustomVerbChange(body.infinitive);
  }

  const customVerbInput =
    verbGroup === 'custom-verb-list' ? (
      <>
        <input
          type="text"
          className="custom-verb__input"
          value={currentCustomVerb}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <AddTag handleAddClick={handleAddClick}></AddTag>
      </>
    ) : null;

  const removeAllVerbs =
    customVerbs.length > 0 ? (
      <button
        className="custom-verb__rmv-all-btn"
        type="button"
        onClick={removeCustomVerbs}
      >
        Remove all
      </button>
    ) : null;

  const customVerbsMarkup =
    verbGroup === 'custom-verb-list' ? (
      <>
        <div className="custom-verb__tags">
          {customVerbs.map((verb) => {
            return (
              <Tag verb={verb} key={verb} onRemove={removeCustomVerb}></Tag>
            );
          })}
        </div>
        {removeAllVerbs}
      </>
    ) : null;

  return (
    <div className="custom-verb">
      {customVerbInput}
      {customVerbsMarkup}
    </div>
  );
}

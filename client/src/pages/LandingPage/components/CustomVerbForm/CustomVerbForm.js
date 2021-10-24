import React, { useState } from 'react';
import classNames from 'classnames';
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
  const [customVerbError, setCustomVerbError] = useState(false);
  const [flash, setFlash] = useState('');

  function handleChange(event) {
    event.preventDefault();
    setCustomVerbError(false);
    setCurrentCustomVerb(event.target.value);
  }

  function handleAddClick(event) {
    event.preventDefault();
    addCustomVerb(currentCustomVerb);
  }

  async function addCustomVerb(verb) {
    const response = await fetch('/api/verbs/' + verb);
    if (response.status !== 200) {
      setCustomVerbError(true);
      return;
    } else {
      const body = await response.json();
      if (!customVerbs.includes(body.infinitive)) {
        handleCustomVerbChange(body.infinitive);
      } else {
        setFlash(body.infinitive);
        setTimeout(() => {
          setFlash('');
        }, 500);
      }
      setCurrentCustomVerb('');
    }
  }

  const customVerbInput =
    verbGroup === 'custom-verb-list' ? (
      <div className="custom-verb__input-wrapper">
        <input
          type="text"
          className={classNames({
            'custom-verb__input': !customVerbError,
            'custom-verb__input--incorrect': customVerbError,
          })}
          value={currentCustomVerb}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <AddTag handleAddClick={handleAddClick}></AddTag>
      </div>
    ) : null;

  const customVerbErrorMsg = customVerbError ? (
    <p className="custom-verb__error-msg">Invalid verb</p>
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
        {customVerbErrorMsg}
        <div className="custom-verb__tags">
          {customVerbs.map((verb) => {
            return (
              <Tag
                verb={verb}
                flash={verb === flash}
                key={verb}
                onRemove={removeCustomVerb}
              ></Tag>
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

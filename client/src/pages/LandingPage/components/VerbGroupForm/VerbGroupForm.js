import React, { useEffect, useState } from 'react';
import './VerbGroupForm.css';

export function VerbGroupForm({
  verbGroup,
  onSelectGroup,
  handleChange,
  handleFocus,
  handleBlur,
  focused,
}) {
  const [tags, setTags] = useState([]);
  console.log(focused);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (verbGroup['custom-verb-list']) {
      setTags(verbGroup['custom-verb-list']);
    }
  }, [verbGroup]);

  const verbGroups = [
    'er',
    'ir',
    'irregular-ir',
    'irregular-re',
    'irregular-oir',
    'custom-verb-list',
  ];

  function handleKeyDown({ key }) {
    if (key === 'Enter' && focused === true) {
      console.log('enter');
    }
  }

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

  const customVerbInput =
    verbGroup === 'custom-verb-list' ? (
      <input
        type="text"
        className="verb-group-form__custom-list"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    ) : null;

  const tagMarkup = tags.map((tag) => {
    return <span className="custom-verb-tag">{tag}x</span>;
  });

  return (
    <div className="verb-group-form">
      <h4 className="verb-group-form__heading">Group:</h4>
      {verbGroupMarkup}
      {customVerbInput}
      <div className="custom-verb-tags">{tagMarkup}</div>
    </div>
  );
}

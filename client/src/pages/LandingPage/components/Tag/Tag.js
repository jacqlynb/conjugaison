import classNames from 'classnames';
import React from 'react';
import { RemoveTag } from './RemoveTag';
import './Tag.css';

export function Tag({ verb, onRemove, flash }) {
  console.log(flash);
  function handleClick(event) {
    event.preventDefault();
    onRemove(verb);
  }

  return (
    <div
      id={verb}
      className={classNames({
        'custom-verb__tag': !flash,
        'custom-verb__tag--flash': flash,
      })}
    >
      <span>{verb}</span>
      <RemoveTag id={verb} handleClick={handleClick} />
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './CustomLink.css';

export function CustomLink({ url, route, linkStyle, disabled, text }) {
  return (
    <Link
      to={disabled ? '' : url + route}
      className={classNames({
        'custom-link-button': linkStyle === 'button',
        'custom-link-button--disabled': linkStyle === 'button' && disabled,
      })}
    >
      {text}
    </Link>
  );
}

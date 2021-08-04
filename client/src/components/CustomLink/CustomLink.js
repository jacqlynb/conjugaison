import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './CustomLink.css';

export function CustomLink(props) {
  return (
    <Link
      to={props.url + props.route}
      className={classNames({
        'custom-link-button': props.linkStyle === 'button',
        'custom-link-button--disabled':
          props.linkStyle === 'button' && props.disabled,
      })}
    >
      {props.text}
    </Link>
  );
}

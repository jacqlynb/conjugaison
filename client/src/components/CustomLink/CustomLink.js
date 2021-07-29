import React from 'react';
import {Link} from "react-router-dom";
import './CustomLink.css';

export function CustomLink(props) {
  return (
    <Link to={props.url + props.route}
          className={props.linkStyle === 'button' ? 'custom-link-button' : ''}>
            {props.text}
    </Link>
  );
}
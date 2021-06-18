import React from 'react';
import './ConjugationForm.css';

export function ConjugationForm(props) {
    return (
        <form onSubmit={props.onSubmit}>
        <div className="conjugation-prompt">
          <label className="conjugation-label">{props.pronoun}</label>
          <input
            type="text" name="conjugation"
            onChange={props.onChange}
            value={props.value}
            className={props.classNameProp}
          />
          <input className="conjugation-submit" type="submit" value="Check" />
        </div>
      </form>
    );
}
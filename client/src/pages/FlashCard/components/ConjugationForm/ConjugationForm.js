import React from 'react';
import classNames from 'classnames';
import './ConjugationForm.css';

export function ConjugationForm(props) {

  return (
    <form onSubmit={props.onSubmit} className="conjugation-form">
      <label className="conjugation-label">{props.pronoun}</label>
      <input
        type="text"
        name="conjugation"
        className={classNames({
          'conjugation-input': true,
          'conjugation-input--pending': props.correct == null,
          'conjugation-input--correct': props.correct,
          'conjugation-input--incorrect': props.correct != null && !props.correct,
        })}
        onChange={props.onChange}
        value={props.value} />
      <input className="conjugation-submit" type="submit" value="Check" />
    </form>
  );
}
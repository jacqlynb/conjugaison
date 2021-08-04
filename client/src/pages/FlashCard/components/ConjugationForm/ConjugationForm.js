import React from 'react';
import classNames from 'classnames';
import './ConjugationForm.css';

export function ConjugationForm({
  onSubmit,
  onChange,
  correct,
  pronoun,
  userConjugation,
}) {
  return (
    <form onSubmit={onSubmit} className="conjugation-form">
      <label className="conjugation-label" htmlFor="conjugation">
        {pronoun}
      </label>
      <input
        type="text"
        name="conjugation"
        value={userConjugation}
        onChange={onChange}
        className={classNames({
          'conjugation-input': true,
          'conjugation-input--pending': correct == null,
          'conjugation-input--correct': correct,
          'conjugation-input--incorrect': correct != null && !correct,
        })}
      />
      <input className="conjugation-submit" type="submit" value="vérifiez" />
    </form>
  );
}

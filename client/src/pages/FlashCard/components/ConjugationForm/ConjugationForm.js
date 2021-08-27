import React from 'react';
import classNames from 'classnames';
import './ConjugationForm.css';

export function ConjugationForm({
  onSubmit,
  onChange,
  correct,
  pronoun,
  userConjugation,
  disabled,
}) {
  return (
    <form onSubmit={onSubmit} className="conjugation__form">
      <label className="conjugation__label" htmlFor="conjugation">
        {pronoun}
      </label>
      <input
        type="text"
        onChange={onChange}
        name="conjugation"
        value={userConjugation}
        className={classNames({
          conjugation__input: true,
          'conjugation__input--pending': correct == null,
          'conjugation__input--correct': correct,
          'conjugation__input--incorrect': correct != null && !correct,
        })}
        autoComplete="off"
      />
      <input
        className="conjugation__submit"
        type="submit"
        value="vérifiez"
        disabled={disabled}
      />
    </form>
  );
}

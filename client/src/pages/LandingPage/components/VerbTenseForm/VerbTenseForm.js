import React from 'react';
import './VerbTenseForm.css';

export function VerbTenseForm({ selectedTenses, onSelectTense }) {
  const verbTenses = [
    'indicatif présent',
    'imparfait',
    'passé simple',
    'futur simple',
    'passé composé',
    'plus-que-parfait',
    'futur antérieur',
    'subjonctif présent',
    'subjonctif passé',
    'conditionnel présent',
    'conditionnel passé',
    'impératif',
  ];

  const verbTenseMarkup = verbTenses.map((tense) => {
    return (
      <div className="verb-tense-form__input" key={tense}>
        <input
          type="checkbox"
          id={tense}
          key={tense}
          value={tense}
          onChange={onSelectTense}
          checked={selectedTenses.includes(tense)}
          name={tense}
        />
        <label htmlFor={tense}>{tense}</label>
      </div>
    );
  });

  return (
    <div className="verb-tense-form">
      <h4 className="verb-tense-form__heading">Temps:</h4>
      {verbTenseMarkup}
    </div>
  );
}

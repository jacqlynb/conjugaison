import React from 'react';
import './VerbTenseForm.css';

export function VerbTenseForm(props) {

  const verbTenses = [
    'indicatif présent', 'imparfait', 'passé simple', 'futur simple',
    'passé composé', 'plus-que-parfait', 'futur antérieur',
    'subjonctif présent', 'subjonctif passé', 'conditionnel présent', 
    'conditionnel passé', 'impératif'
  ];

  const verbTenseMarkup = verbTenses.map(tense => {
    return(
      <div className="verb-tense-checkbox" key={tense}>
      <input type="checkbox"
             className="verb-tense"
             id={tense}
             key={tense}
             name={tense}
             value={tense}
             onChange={props.onSelectTense}
             checked={(props.selectedTenses.includes(tense)) ? true : false}/>
      <label htmlFor={tense}>{tense}</label>
      </div>
    );
  });

  return(
    <div className="verb-tense-form">
      <h4>Temps:</h4>
      {verbTenseMarkup}
    </div>
  );
}
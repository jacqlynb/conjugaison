import React, {useState} from 'react';
import {Link, useRouteMatch} from "react-router-dom";
import {VerbGroupForm, VerbTenseForm, NumberOfPromptsForm} from '../../components';
import './Wizard.css';

export function Wizard(props) {
  const [step, setStep] = useState(0);
  let {url} = useRouteMatch();

  const verbTenseForm = 
    <div>
      <VerbTenseForm 
        onSelectTense={props.onSelectTense} 
        selectedTenses={props.selectedTenses} />
      <input type="button" value="next" onClick={() => setStep(1)}/>              
    </div>;

  const verbGroupForm = 
    <div>
      <VerbGroupForm 
        onSelectGroup={props.onSelectGroup}
        verbGroup={props.verbGroup} />
      <input type="button" value="back" onClick={() => setStep(0)}/>              
      <input type="button" value="next" onClick={() => setStep(2)}/>              
    </div>;

  const numberOfPromptsForm =
    <div>
      <input type="button" value="back" onClick={() => setStep(1)}/>              
      <NumberOfPromptsForm 
        onSelectNumPrompts={props.onSelectNumPrompts}/>

      <button><Link to={`${url}flashcard`}>Commencez</Link></button>
    </div>;

  return (
    <div>
      {step === 0 ? verbTenseForm : ''}
      {step === 1 ? verbGroupForm : ''}
      {step === 2 ? numberOfPromptsForm : ''}
    </div>
  );
}
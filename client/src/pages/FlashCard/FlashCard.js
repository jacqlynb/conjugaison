import React from 'react';
import {Prompt, ConjugationForm} from './components'

export function FlashCard(props) {
    const correctResponse = (
        <div className="correct-response">
          {(props.correctConjugation !== '') 
                   ? props.correctConjugation
                   : ' ' }
        </div>
    )
  
    const tally = (
        <p>{props.numCorrectConjugations}/
           {props.numCorrectConjugations + props.numIncorrectConjugations}</p>
    );

    return (
        <div className="flashcard">
          <Prompt currentTense={props.currentTense}
                  infinitive={props.infinitive} />
          <ConjugationForm onSubmit={props.onSubmit}
                           pronoun={props.pronoun}
                           onChange={props.onChange}
                           value={props.userConjugation}
                           classNameProp={props.conjugationValidation} />
          {correctResponse}
          {tally}
        </div>
    );
}
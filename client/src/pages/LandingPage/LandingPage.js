import React from 'react';
import {VerbTenseForm, VerbGroupForm, NumberOfPromptsForm} from './components';
import {CustomLink} from '../../components';
import {useRouteMatch} from "react-router-dom";
import './LandingPage.css';

export function LandingPage(props) {
  let {url} = useRouteMatch();

  return (
    <form className="parameters-form">
      <VerbTenseForm onSelectTense={props.onSelectTense} 
                     selectedTenses={props.selectedTenses} />
      <VerbGroupForm onSelectGroup={props.onSelectGroup}
                     verbGroup={props.verbGroup} />
      <NumberOfPromptsForm onSelectNumPrompts={props.onSelectNumPrompts}
                           numPrompts={props.numPrompts}/>
      <CustomLink url={url}
                  route="flashcard"
                  text="Commencez" 
                  linkStyle="button"
                  disabled={props.numPrompts === 0}/>
    </form>
  );
}
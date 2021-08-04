import React, { useEffect } from 'react';
import {
  VerbTenseForm,
  VerbGroupForm,
  NumberOfPromptsForm,
} from './components';
import { CustomLink } from '../../components';
import { useConjugationHistory } from '../../utilities';
import { useRouteMatch } from 'react-router-dom';
import './LandingPage.css';

export function LandingPage(props) {
  const { clearRecords } = useConjugationHistory();

  // clear records any time landing page is reached
  useEffect(() => {
    clearRecords();
  }, []);

  let { url } = useRouteMatch();

  return (
    <form className="parameters-form">
      <VerbTenseForm
        onSelectTense={props.onSelectTense}
        selectedTenses={props.selectedTenses}
      />
      <VerbGroupForm
        onSelectGroup={props.onSelectGroup}
        verbGroup={props.verbGroup}
      />
      <NumberOfPromptsForm
        onSelectNumPrompts={props.onSelectNumPrompts}
        numPrompts={props.numPrompts}
      />
      <CustomLink
        url={url}
        route="flashcard"
        text="Commencez"
        linkStyle="button"
        disabled={props.numPrompts === 0}
      />
    </form>
  );
}

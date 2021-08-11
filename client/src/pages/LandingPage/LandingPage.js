import React, { useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import {
  VerbTenseForm,
  VerbGroupForm,
  NumberOfPromptsForm,
} from './components';
import { CustomLink } from '../../components';
import { useConjugationHistory } from '../../utilities';
import './LandingPage.css';

export function LandingPage({
  onSelectTense,
  selectedTenses,
  onSelectGroup,
  verbGroup,
  onSelectNumPrompts,
  numPrompts,
}) {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { clearRecords } = useConjugationHistory();

  // clear records any time landing page is reached
  useEffect(() => {
    clearRecords();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function handleKeyDown({ key }) {
    if (key === 'Enter') {
      history.push('/flashcard');
    }
  }

  return (
    <form className="parameters-form">
      <VerbTenseForm
        onSelectTense={onSelectTense}
        selectedTenses={selectedTenses}
      />
      <VerbGroupForm onSelectGroup={onSelectGroup} verbGroup={verbGroup} />
      <NumberOfPromptsForm
        onSelectNumPrompts={onSelectNumPrompts}
        numPrompts={numPrompts}
      />
      <CustomLink
        url={url}
        route="flashcard"
        text="Commencez"
        linkStyle="button"
        disabled={numPrompts === 0}
      />
    </form>
  );
}

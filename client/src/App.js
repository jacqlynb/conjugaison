import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ConjugationHistoryContext, storage } from './utilities';
import { LandingPage, FlashCard, Summary, Wizard } from './pages';
import { Header, Description } from './components';
import './App.css';

export function App() {
  const [wizardMode, setWizardMode] = useState(false);
  const [conjugationHistory, setConjugationHistory] = useState(
    storage.getItem('conjugationHistory') ?? []
  );
  const [tenses, setTenses] = useState(
    storage.getItem('tenses') ?? ['indicatif présent']
  );
  const [verbGroup, setVerbGroup] = useState(
    storage.getItem('verbGroup') ?? 'er'
  );
  const [numPrompts, setNumPrompts] = useState(
    storage.getItem('numPrompts') ?? 0
  );

  useEffect(() => {
    storage.setItem('conjugationHistory', conjugationHistory);
  });

  useEffect(() => {
    storage.setItem('tenses', tenses);
  }, [tenses]);

  useEffect(() => {
    storage.setItem('verbGroup', verbGroup);
  }, [verbGroup]);

  useEffect(() => {
    storage.setItem('numPrompts', numPrompts);
  }, [numPrompts]);

  function handleVerbTenseChange(event) {
    const currentTenses = [...tenses];

    // ensure that at least one input remains selected at all times
    if (
      currentTenses.includes(event.target.value) &&
      currentTenses.length !== 1
    ) {
      currentTenses.splice(currentTenses.indexOf(event.target.value), 1);
    } else if (!currentTenses.includes(event.target.value)) {
      currentTenses.push(event.target.value);
    }

    setTenses(currentTenses);
  }

  function handleVerbGroupChange(event) {
    setVerbGroup(event.target.value);
  }

  function handleNumPromptsChange(event) {
    const prevNumPrompts = numPrompts;
    let newNumPrompts;

    if (event.target.value === '') {
      newNumPrompts = 0;
    } else {
      newNumPrompts = Number.isNaN(parseInt(event.target.value))
        ? prevNumPrompts
        : parseInt(event.target.value);
    }

    setNumPrompts(newNumPrompts);
  }

  function addRecord(record) {
    setConjugationHistory([...conjugationHistory, record]);
  }

  function clearRecords() {
    setConjugationHistory([]);
  }

  return (
    <ConjugationHistoryContext.Provider
      value={{
        records: conjugationHistory,
        addRecord,
        clearRecords,
      }}
    >
      <Header />
      <main>
        <Router>
          <Switch>
            <Route exact path="/">
              {wizardMode ? (
                <Wizard
                  onSelectTense={handleVerbTenseChange}
                  selectedTenses={tenses}
                  onSelectGroup={handleVerbGroupChange}
                  onSelectNumPrompts={handleNumPromptsChange}
                  verbGroup={verbGroup}
                />
              ) : (
                <>
                  <Description />
                  <LandingPage
                    onSelectTense={handleVerbTenseChange}
                    selectedTenses={tenses}
                    onSelectGroup={handleVerbGroupChange}
                    onSelectNumPrompts={handleNumPromptsChange}
                    verbGroup={verbGroup}
                    numPrompts={numPrompts}
                  />
                </>
              )}
            </Route>
            <Route path="/flashcard">
              <FlashCard
                tenses={tenses}
                verbGroup={verbGroup}
                numPrompts={numPrompts}
              />
            </Route>
            <Route path="/summary">
              <Summary />
            </Route>
          </Switch>
        </Router>
      </main>
    </ConjugationHistoryContext.Provider>
  );
}

export default App;

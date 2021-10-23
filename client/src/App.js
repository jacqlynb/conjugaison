import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ConjugationHistoryContext, storage } from './utilities';
import { LandingPage, FlashCard, Summary, Wizard } from './pages';
import { Header, Description } from './components';
import './App.css';

export function App() {
  const [wizardMode, setWizardMode] = useState(false);
  const [conjugationHistory, setConjugationHistory] = useState([]);
  const [tenses, setTenses] = useState(
    storage.getItem('tenses') ?? ['indicatif présent']
  );
  const [verbGroup, setVerbGroup] = useState(
    storage.getItem('verbGroup') ?? 'er'
  );
  const [customVerbs, setCustomVerbs] = useState(
    storage.getItem('customVerbs') ?? []
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
    storage.setItem('customVerbs', customVerbs);
  }, [customVerbs]);

  useEffect(() => {
    storage.setItem('numPrompts', numPrompts);
  }, [numPrompts]);

  useEffect(() => {
    setWizardMode(wizardMode);
  }, [wizardMode]);

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

  function handleCustomVerbChange(verb) {
    const prevCustomVerbs = [...customVerbs];
    prevCustomVerbs.push(verb);
    setCustomVerbs(prevCustomVerbs);
  }

  function removeCustomVerbs() {
    setCustomVerbs([]);
  }

  function removeCustomVerb(verb) {
    if (customVerbs.length === 0) {
      return;
    }
    if (!customVerbs.includes(verb)) {
      return;
    }
    let prevCustomVerbs = [...customVerbs];
    prevCustomVerbs.splice(prevCustomVerbs.indexOf(verb), 1);
    setCustomVerbs(prevCustomVerbs);
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
                    verbGroup={verbGroup}
                    customVerbs={customVerbs}
                    handleCustomVerbChange={handleCustomVerbChange}
                    removeCustomVerbs={removeCustomVerbs}
                    removeCustomVerb={removeCustomVerb}
                    onSelectNumPrompts={handleNumPromptsChange}
                    numPrompts={numPrompts}
                  />
                </>
              )}
            </Route>
            <Route path="/flashcard">
              <FlashCard
                tenses={tenses}
                verbGroup={verbGroup}
                customVerbs={customVerbs}
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

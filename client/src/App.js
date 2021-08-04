import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ConjugationHistoryContext, useConjugationHistory } from './utilities';
import { LandingPage, FlashCard, Summary, Wizard } from './pages';
import { Header, Description } from './components';
import './App.css';

export function App() {
  const [conjugationHistory, setConjugationHistory] = useState([]);
  const [wizardMode, setWizardMode] = useState(false);
  const [tenses, setTenses] = useState(['indicatif présent']);
  const [verbGroup, setVerbGroup] = useState('er');
  const [numPrompts, setNumPrompts] = useState(10);

  function handleVerbTenseChange(event) {
    const tenses = [...tenses];

    // ensure that at least one input remains selected at all times
    if (tenses.includes(event.target.value) && tenses.length !== 1) {
      tenses.splice(tenses.indexOf(event.target.value), 1);
    } else if (!tenses.includes(event.target.value)) {
      tenses.push(event.target.value);
    }

    setTenses(tenses);
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
      <Router>
        <div>
          <Header />
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
        </div>
      </Router>
    </ConjugationHistoryContext.Provider>
  );
}

export default App;

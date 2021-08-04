import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ConjugationHistoryContext } from './utilities';
import { LandingPage, FlashCard, Summary, Wizard } from './pages';
import { Header, Description } from './components';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleVerbTenseChange = this.handleVerbTenseChange.bind(this);
    this.handleVerbGroupChange = this.handleVerbGroupChange.bind(this);
    this.handleNumPromptsChange = this.handleNumPromptsChange.bind(this);
    this.addRecord = this.addRecord.bind(this);
  }

  state = {
    wizardMode: false,
    tenses: ['indicatif présent'],
    verbGroup: 'er',
    currentTense: 'indicatif présent',
    conjugationHistory: [],
    numPrompts: 10,
  };

  handleVerbTenseChange(event) {
    const tenses = [...this.state.tenses];

    // ensure that at least one input remains selected at all times
    if (tenses.includes(event.target.value) && tenses.length !== 1) {
      tenses.splice(tenses.indexOf(event.target.value), 1);
    } else if (!tenses.includes(event.target.value)) {
      tenses.push(event.target.value);
    }

    this.setState({ tenses });
  }

  handleVerbGroupChange(event) {
    this.setState({ verbGroup: event.target.value });
  }

  handleNumPromptsChange(event) {
    const prevNumPrompts = this.state.numPrompts;
    let newNumPrompts;

    if (event.target.value === '') {
      newNumPrompts = 0;
    } else {
      newNumPrompts = Number.isNaN(parseInt(event.target.value))
        ? prevNumPrompts
        : parseInt(event.target.value);
    }

    this.setState({ numPrompts: newNumPrompts });
  }

  addRecord(record) {
    this.setState({
      conjugationHistory: [...this.state.conjugationHistory, record],
    });
  }

  render() {
    return (
      <ConjugationHistoryContext.Provider
        value={{
          records: this.state.conjugationHistory,
          addRecord: this.addRecord,
        }}
      >
        <Router>
          <div>
            <Header />
            <Description />
            <Switch>
              <Route exact path="/">
                {this.state.wizardMode ? (
                  <Wizard
                    onSelectTense={this.handleVerbTenseChange}
                    selectedTenses={this.state.tenses}
                    onSelectGroup={this.handleVerbGroupChange}
                    onSelectNumPrompts={this.handleNumPromptsChange}
                    verbGroup={this.state.verbGroup}
                  />
                ) : (
                  <LandingPage
                    onSelectTense={this.handleVerbTenseChange}
                    selectedTenses={this.state.tenses}
                    onSelectGroup={this.handleVerbGroupChange}
                    onSelectNumPrompts={this.handleNumPromptsChange}
                    verbGroup={this.state.verbGroup}
                    numPrompts={this.state.numPrompts}
                  />
                )}
              </Route>
              <Route path="/flashcard">
                <FlashCard
                  infinitive={this.state.infinitive}
                  tenses={this.state.tenses}
                  verbGroup={this.state.verbGroup}
                  numPrompts={this.state.numPrompts}
                />
              </Route>
              <Route path="/summary">
                <Summary setSummaryInfo={this.setSummaryInfo} />
              </Route>
            </Switch>
          </div>
        </Router>
      </ConjugationHistoryContext.Provider>
    );
  }
}

export default App;

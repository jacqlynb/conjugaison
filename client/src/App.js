import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import {LandingPage, FlashCard, Summary, Wizard} from './pages';
import {Header, Description} from './components';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleVerbTenseChange = this.handleVerbTenseChange.bind(this);
    this.handleVerbGroupChange = this.handleVerbGroupChange.bind(this);
    this.handleNumPromptsChange = this.handleNumPromptsChange.bind(this);
    this.fetchRandomVerb = this.fetchRandomVerb.bind(this);
    this.getRandomVerbUrl = this.getRandomVerbUrl.bind(this);
    this.getRandomPronoun = this.getRandomPronoun.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConjugationChange = this.handleConjugationChange.bind(this);
    this.fetchCorrectConjugation = this.fetchCorrectConjugation.bind(this);
    this.getPrompt = this.getPrompt.bind(this);
  }

  state = {
    wizardMode: false,
    tenses: ['indicatif présent'],
    verbGroup: 'er',
    pronoun: '',
    infinitive: '',
    currentTense: 'indicatif présent',
    userConjugation: '',
    correctConjugation: '',
    correct: null,
    conjugationHistory: new Map(),
    correctConjugations: [],
    incorrectConjugations: [],
    numPrompts: 10,
    totalConjugations: 0
  };

  componentDidMount() {
    this.getPrompt();
  }

  handleVerbTenseChange(event) {
    const tenses = [...this.state.tenses];

    if (tenses.includes(event.target.value) && tenses.length !== 1) {
      tenses.splice(tenses.indexOf(event.target.value), 1);
    } else if (!tenses.includes(event.target.value)){
      tenses.push(event.target.value);
    }

    this.setState({tenses});
  }

  handleVerbGroupChange(event) {
    this.setState({verbGroup: event.target.value});
  }

  handleNumPromptsChange(event) {
    const prevNumPrompts = this.state.numPrompts;
    let newNumPrompts; 

    if (event.target.value === '') {
      newNumPrompts = 0;
    } else {
      newNumPrompts = (Number.isNaN(parseInt(event.target.value))) 
        ? prevNumPrompts
        : parseInt(event.target.value);
    }

    this.setState({numPrompts: newNumPrompts});
  }

  async fetchRandomVerb() {
    const url = this.getRandomVerbUrl("/api/verb");

    try {
      const data = await fetch(url);
      const verb = await data.json();
      return verb.infinitive;
    } catch (error) {
      console.log('error in callApi', error);
    }
  }

  getRandomVerbUrl(path) {
    const url = new URL(path, window.location.origin);
    const params = {group: this.state.verbGroup};

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url;
  }

  getConjugationUrl(path) {
    const url = new URL(path, window.location.origin), params = {
      tense: this.state.currentTense, 
      pronoun: this.state.pronoun, 
      infinitive: this.state.infinitive
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url;
  }

  getRandomPronoun() {
    const pronouns = ['je', 'tu', ['il', 'elle'], 'nous', 'vous', ['ils', 'elles']];
    const randomIndex = Math.floor(Math.random() * pronouns.length);
    
    if (Array.isArray(pronouns[randomIndex])) {
      const genderIndex = Math.floor(Math.random() * 2);
      return pronouns[randomIndex][genderIndex];
    } else {
      return pronouns[randomIndex];
    }
  }

  handleConjugationChange(event) {
    event.preventDefault();
    this.setState({userConjugation: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({userConjugation: event.target.elements.conjugation.value});

    this.fetchCorrectConjugation().then(() => {
      if (this.state.correctConjugation !== '') {
        this.validateConjugation();
        setTimeout(this.getPrompt, 1500);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async fetchCorrectConjugation() {
    try {
      let url = this.getConjugationUrl('/api/conjugation');
      console.log('url', url);
      const data = await fetch(url);
      const verb = await data.json();

      this.setState({correctConjugation: verb.conjugation});
    } catch (error) {
      console.log('error in callApi', error);
    }
  }

  validateConjugation() {
    if (this.state.userConjugation === this.state.correctConjugation) {
      // use local/session storage for conjugation history???
      this.state.conjugationHistory.set(this.state.infinitive, {})
      let correctConjugations = [...this.state.correctConjugations];
      correctConjugations.push(this.state.infinitive);

      this.setState(prevState => ({
        correct: true,
        correctConjugations,
        totalConjugations: prevState.totalConjugations + 1
      }))
    } else {
      let incorrectConjugations = [...this.state.incorrectConjugations];
      incorrectConjugations.push(this.state.infinitive);
      
      this.setState(prevState => ({
        correct: false,
        incorrectConjugations,
        totalConjugations: prevState.totalConjugations + 1
      }))
    }
  }

  getPrompt() {
    const pronoun = this.getRandomPronoun();
    this.fetchRandomVerb().then((infinitive) => {
      this.setState(prevState => ({
        pronoun,
        infinitive,
        currentTense: prevState.tenses[Math.floor(Math.random() * this.state.tenses.length)],
        userConjugation: '',
        correctConjugation: '',
        correct: null,
      }));
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return(
      <Router>
        <div>
        <Header/>
        <Description/>
        <Switch>
          <Route exact path="/">
            {(this.state.wizardMode)
            ? <Wizard onSelectTense={this.handleVerbTenseChange}
                    selectedTenses={this.state.tenses}
                    onSelectGroup={this.handleVerbGroupChange}
                    onSelectNumPrompts={this.handleNumPromptsChange}
                    verbGroup={this.state.verbGroup} /> 
            : <LandingPage onSelectTense={this.handleVerbTenseChange}
                         selectedTenses={this.state.tenses}
                         onSelectGroup={this.handleVerbGroupChange}
                         onSelectNumPrompts={this.handleNumPromptsChange}
                         verbGroup={this.state.verbGroup}
                         numPrompts={this.state.numPrompts} />}
          </Route>
          <Route path="/flashcard">
            {(this.state.totalConjugations === this.state.numPrompts)
            ? <Redirect to="/summary" /> 
            : <FlashCard currentTense={this.state.currentTense}
                       infinitive={this.state.infinitive}
                       pronoun={this.state.pronoun}
                       value={this.state.userConjugation}
                       onChange={this.handleConjugationChange}
                       onSubmit={this.handleSubmit}
                       correctConjugation={this.state.correctConjugation}
                       numCorrectConjugations={this.state.correctConjugations.length}
                       numIncorrectConjugations={this.state.incorrectConjugations.length}
                       correct={this.state.correct} />}
          </Route>
          <Route path="/summary">
            <Summary numCorrectConjugations={this.state.correctConjugations.length}
                     totalConjugations={this.state.totalConjugations} />
          </Route>
        </Switch> 
        </div>
      </Router>
    )
  } 
}

export default App;

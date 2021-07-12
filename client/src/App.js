import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {LandingPage, FlashCard} from './pages';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleVerbTenseChange = this.handleVerbTenseChange.bind(this);
    this.handleVerbGroupChange = this.handleVerbGroupChange.bind(this);
    this.fetchRandomVerb = this.fetchRandomVerb.bind(this);
    this.getRandomVerbUrl = this.getRandomVerbUrl.bind(this);
    this.getRandomPronoun = this.getRandomPronoun.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConjugationChange = this.handleConjugationChange.bind(this);
    this.fetchCorrectConjugation = this.fetchCorrectConjugation.bind(this);
    this.next = this.next.bind(this);
  }

  state = {
    tenses: ['indicatif présent'],
    verbGroup: 'er',
    pronoun: '',
    infinitive: '',
    currentTense: 'indicatif présent',
    userConjugation: '',
    correctConjugation: '',
    correct: null,
    correctConjugations: [],
    incorrectConjugations: []
  };

  componentDidMount() {
    this.next();
  }

  handleVerbTenseChange(event) {
    const tenses = [...this.state.tenses];

    if (tenses.includes(event.target.value) && tenses.length !== 1) {
      tenses.splice(tenses.indexOf(event.target.value), 1);
    } else if (!tenses.includes(event.target.value)){
      tenses.push(event.target.value);
    }
    
    // verb prompt must not update if the current tense is still checked
    this.setState({tenses}, () => {
      if (!tenses.includes(this.state.currentTense)) {
        this.next();
      }
    });
  }

  handleVerbGroupChange(event) {
    this.setState({verbGroup: event.target.value}, this.next);
  }

  async fetchRandomVerb() {
    const url = this.getRandomVerbUrl("http://localhost:8080/verb");

    try {
      const data = await fetch(url);
      const verb = await data.json();
      return verb.infinitive;
    } catch (error) {
      console.log('error in callApi', error);
    }
  }

  getRandomVerbUrl(base) {
    const url = new URL(base);
    const params = {group: this.state.verbGroup};

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url;
  }

  getConjugationUrl(base) {

    const url = new URL(base), params = {
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
        setTimeout(this.next, 1500);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async fetchCorrectConjugation() {
    try {
      let url = this.getConjugationUrl('http://localhost:8080/conjugation')
      const data = await fetch(url);
      const verb = await data.json();

      this.setState({correctConjugation: verb.conjugation});
    } catch (error) {
      console.log('error in callApi', error);
    }
  }

  validateConjugation() {
    if (this.state.userConjugation === this.state.correctConjugation) {
      let correctConjugations = [...this.state.correctConjugations];
      correctConjugations.push(this.state.infinitive);

      this.setState({
        correct: true,
        correctConjugations
      })
    } else {
      let incorrectConjugations = [...this.state.incorrectConjugations];
      incorrectConjugations.push(this.state.infinitive);
      
      this.setState({
        correct: false,
        incorrectConjugations
      })
    }
  }

  next() {
    const pronoun = this.getRandomPronoun();
    this.fetchRandomVerb().then((infinitive) => {
      this.setState({
        pronoun,
        infinitive,
        currentTense: this.state.tenses[Math.floor(Math.random() * this.state.tenses.length)],
        userConjugation: '',
        correctConjugation: '',
        correct: null,
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return(
      <Router>
        <div>
        <Switch>
          <Route exact path="/">
            <LandingPage onSelectTense={this.handleVerbTenseChange}
                         selectedTenses={this.state.tenses}
                         onSelectGroup={this.handleVerbGroupChange}
                         verbGroup={this.state.verbGroup} />
          </Route>
          <Route path="/flashcard">
            <FlashCard currentTense={this.state.currentTense}
                       infinitive={this.state.infinitive}
                       pronoun={this.state.pronoun}
                       value={this.state.userConjugation}
                       onChange={this.handleConjugationChange}
                       onSubmit={this.handleSubmit}
                       correctConjugation={this.state.correctConjugation}
                       numCorrectConjugations={this.state.correctConjugations.length}
                       numIncorrectConjugations={this.state.incorrectConjugations.length}
                       correct={this.state.correct} />
          </Route>
        </Switch> 
        </div>
      </Router>
    )
  } 
}

export default App;

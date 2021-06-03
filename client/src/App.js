import React, {Component} from 'react';
import {VerbTenseForm} from './components';
import {VerbGroupForm} from './components';
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
    userConjugation: '',
    correctConjugation: '',
    conjugationValidation: '',
    correctConjugations: [],
    incorrectConjugations: []
  };

  componentDidMount() {
    this.next();
  }

  handleVerbTenseChange(event) {
    const tenses = [...this.state.tenses];

    if (tenses.includes(event.target.value)) {
      tenses.splice(tenses.indexOf(event.target.value), 1);
    } else {
      tenses.push(event.target.value);
    }
    
    this.setState({tenses}, this.next);
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
      console.log('conjugation', verb.conjugation);

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
        conjugationValidation: 'correct',
        correctConjugations
      })
    } else {
      let incorrectConjugations = [...this.state.incorrectConjugations];
      incorrectConjugations.push(this.state.infinitive);
      
      this.setState({
        conjugationValidation: 'incorrect',
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
        conjugationValidation: '',
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const prompt = (
      <div className="prompt">
        <p>{this.state.currentTense}</p>
        <span className="infinitive">{this.state.infinitive === '' 
                                ? <span>&nbsp;</span> 
                                : ` (${this.state.infinitive})`}
        </span>
      </div>
    );

    const conjugationForm = (
      <form onSubmit={this.handleSubmit}>
        <div className="conjugation-prompt">
          <label className="conjugation-label">{this.state.pronoun}</label>
          <input
            type="text" name="conjugation"
            onChange={this.handleConjugationChange}
            value={this.state.userConjugation}
            className={this.state.conjugationValidation}
          />
          <input className="conjugation-submit" type="submit" value="Check" />
        </div>
      </form>
    );

    const correctResponse = (
      <div className="correct-response">
        {(this.state.correctConjugation !== '') 
                 ? this.state.correctConjugation
                 : ' ' }
      </div>
    )

    const tally = (
      <p>{this.state.correctConjugations.length}/
         {this.state.correctConjugations.length + this.state.incorrectConjugations.length}</p>
    );

    return(
      <div className="container">
        <div className="parameters">
          <VerbTenseForm onSelectTense={this.handleVerbTenseChange} />
          <VerbGroupForm onSelect={this.handleVerbGroupChange} />
        </div>
        <div className="flashcard">
          {prompt}
          {conjugationForm}
          {correctResponse}
          {tally}
        </div>
      </div>
    )
  } 
}

export default App;

import React, {Component} from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.fetchRandomVerb = this.fetchRandomVerb.bind(this);
    this.getRandomPronoun = this.getRandomPronoun.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchCorrectConjugation = this.fetchCorrectConjugation.bind(this);
    this.next = this.next.bind(this);
  }

  state = {
    mood: 'indicative',
    tense: 'present',
    pronoun: '',
    infinitive: '',
    userConjugation: '',
    correctConjugation: '',
    conjugationValidation: ''
  };

  componentDidMount() {
    this.next();
  }

  async fetchRandomVerb() {
    try {
      const data = await fetch('/verb');
      const verb = await data.json();
      return verb.infinitive;
    } catch (error) {
      console.log('error in callApi', error);
    }
  }

  async fetchCorrectConjugation() {
    try {
      let url = this.getConjugationUrl('http://localhost:8080/conjugation')
      const data = await fetch(url);
      const body = await data.text();
      const verb = JSON.parse(body);
      this.setState({correctConjugation: verb.conjugation});
    } catch (error) {
      console.log('error in callApi', error);
    }
  }

  getConjugationUrl(base) {
    let url = new URL(base), params = {
      mood: this.state.mood,
      tense: this.state.tense, 
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

  handleChange(event) {
    event.preventDefault();
    this.setState({userConjugation: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const userConjugation = event.target.elements.conjugation.value;
    this.setState({userConjugation});
    this.fetchCorrectConjugation().then(() => {
      if (this.state.correctConjugation !== '') {
        this.setState({conjugationValidation: (userConjugation === this.state.correctConjugation)
          ? 'correct'
          : 'incorrect'
        });
        setTimeout(this.next, 1500);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  next() {
    const pronoun = this.getRandomPronoun();
    this.fetchRandomVerb().then((infinitive) => {
      this.setState({
        pronoun,
        infinitive,
        userConjugation: '',
        correctConjugation: '',
        conjugationValidation: '',
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return(
      <div>
        <p>{this.state.pronoun} {this.state.infinitive === '' ? <span>&nbsp;</span> : `(${this.state.infinitive})`}</p>
        <form onSubmit={this.handleSubmit}>
            <input
              type="text" name="conjugation"
              onChange={this.handleChange}
              value={this.state.userConjugation}
              className={this.state.conjugationValidation}
            />
            <input type="submit" value="Check" />
          </form>
      </div>
    )
  } 
}

export default App;

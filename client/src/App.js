import React, {Component} from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
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
    mood: 'indicative',
    tense: 'present',
    verbGroup: 'er',
    pronoun: '',
    infinitive: '',
    userConjugation: '',
    correctResponse: '',
    conjugationValidation: '',
    correctConjugations: [],
    incorrectConjugations: []
  };

  componentDidMount() {
    this.next();
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

  handleConjugationChange(event) {
    event.preventDefault();
    this.setState({userConjugation: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({userConjugation: event.target.elements.conjugation.value});
    this.fetchCorrectConjugation().then(() => {
      if (this.state.correctResponse !== '') {
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
      this.setState({correctResponse: verb.conjugation});
    } catch (error) {
      console.log('error in callApi', error);
    }
  }

  validateConjugation() {
    if (this.state.userConjugation === this.state.correctResponse) {
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
        userConjugation: '',
        correctConjugation: '',
        conjugationValidation: '',
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const verbGroups = ['er', 'ir', 'irregular-ir', 'irregular-re', 'irregular-oir'];
    const verbGroupMarkup = verbGroups.map(verbGroup => {
      return (
        <div key={'verb-group-' + verbGroup}>
          <input type="radio"
                 id={verbGroup}
                 name="verb-group" 
                 value={verbGroup} 
                 defaultChecked={verbGroup === 'er' ? true : false}
                 onChange={this.handleVerbGroupChange} />
          <label htmlFor="er">
            {verbGroup.includes('irregular') 
              ? verbGroup.replace('-', ' -') 
              : verbGroup}
          </label>
        </div>
      );
    });

    const verbGroupForm = (
      <div className="verb-group">
        <p>Verb Group:</p>
        {verbGroupMarkup}
      </div>
    );

    const prompt = (
      <p>
        {this.state.pronoun} 
        {this.state.infinitive === '' ? <span>&nbsp;</span> : ` (${this.state.infinitive})`}
      </p>
    );

    const conjugationForm = (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text" name="conjugation"
          onChange={this.handleConjugationChange}
          value={this.state.userConjugation}
          className={this.state.conjugationValidation}
        />
        <input type="submit" value="Check" />
      </form>
    );

    const tally = (
      <p>{this.state.correctConjugations.length}/
         {this.state.correctConjugations.length + this.state.incorrectConjugations.length}</p>
    );

    return(
      <div>
        {verbGroupForm}
        {prompt}
        {conjugationForm}
        {tally}
      </div>
    )
  } 
}

export default App;

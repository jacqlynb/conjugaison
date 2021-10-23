import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import {
  useConjugationHistory,
  getCorrectResponse,
  getCurrentStreak,
} from '../../utilities';
import { Prompt, ConjugationForm } from './components';
import './FlashCard.css';

export function FlashCard({ tenses, verbGroup, customVerbs, numPrompts }) {
  const { records, addRecord } = useConjugationHistory();
  const [infinitive, setInfinitive] = useState(null);
  const [pronoun, setPronoun] = useState(null);
  const [tense, setTense] = useState(null);
  const [userConjugation, setUserConjugation] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [done, setDone] = useState(false);

  const _isMounted = useRef(true);

  const pronouns = [
    'je',
    'tu',
    ['il', 'elle'],
    'nous',
    'vous',
    ['ils', 'elles'],
  ];

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (promptIndex === numPrompts) {
      setDone(true);
    }
  }, [promptIndex, numPrompts]);

  useEffect(() => {
    setTense(getRandomTense(tenses));
    setCorrect(null);

    if (verbGroup === 'custom-verb-list') {
      setInfinitive(fetchRandomCustomVerb());
      setPronoun(getCustomVerbPronoun());
    } else {
      fetchRandomVerb(verbGroup)
        .then((verb) => {
          if (_isMounted.current) {
            setInfinitive(verb);
            setPronoun(getRandomPronoun());
          }
        })
        .catch((error) => {
          console.log('Error fetching verb', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verbGroup, tenses, promptIndex]);

  const correctResponse = useMemo(
    () => getCorrectResponse(records),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records.length]
  );

  async function fetchRandomVerb(verbGroup) {
    if (verbGroup === 'custom-verb-list') {
      console.log('fetching random custom verb');
      return fetchRandomCustomVerb();
    }
    const url = buildUrl('/verb', { group: verbGroup });

    try {
      const data = await fetch(url);
      const { infinitive } = await data.json();
      return infinitive;
    } catch (error) {
      console.log('error in callApi', error);
    }
  }

  function fetchRandomCustomVerb() {
    if (customVerbs.length === 0) {
      return new Error('no custom verbs selected');
    }
    let numCycles = Math.floor(records.length / customVerbs.length);
    let foundVerbNotPracticed = false;

    while (!foundVerbNotPracticed) {
      let verb = customVerbs[getRandomIndex(customVerbs.length)];
      if (
        records.filter((record) => record.infinitive === verb).length <=
        numCycles
      ) {
        return verb;
      }
    }
  }

  function handleChange(event) {
    setUserConjugation(event.target.value.toLowerCase());
  }

  async function submit(event) {
    event.preventDefault();

    if (disabled) {
      return;
    }
    setDisabled(true);

    const correctConjugation = await fetchCorrectConjugation(
      tense,
      pronoun,
      infinitive
    );
    setCorrect(userConjugation === correctConjugation);

    addRecord({
      infinitive,
      tense,
      group: verbGroup,
      pronoun,
      userConjugation,
      correctConjugation,
    });

    setTimeout(() => {
      if (_isMounted.current) {
        setUserConjugation('');
        setDisabled(false);
        setPromptIndex((previousIndex) => previousIndex + 1);
      }
    }, 1500);
  }

  async function fetchCorrectConjugation(tense, pronoun, infinitive) {
    const url = buildUrl('/conjugation', { tense, pronoun, infinitive });

    try {
      const data = await fetch(url);
      const { conjugation } = await data.json();
      return conjugation;
    } catch (error) {
      console.log('error in callApi', error);
    }
  }

  function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  function getCustomVerbPronoun() {
    if (customVerbs.length === 0) {
      return '';
    }
    let numCycles = Math.floor(
      records.length / customVerbs.length / pronouns.length
    );
    let foundUnpracticedPronoun = false;

    while (!foundUnpracticedPronoun) {
      let pronoun = getRandomPronoun();

      let cycle = records.reduce((acc, curr) => {
        return curr.infinitive === infinitive && curr.pronoun === pronoun
          ? acc + 1
          : acc;
      }, 0);

      if (cycle <= numCycles) {
        return pronoun;
      }
    }
  }

  function getRandomPronoun() {
    const randomIndex = getRandomIndex(pronouns.length);

    if (Array.isArray(pronouns[randomIndex])) {
      const genderIndex = getRandomIndex(2);
      return pronouns[randomIndex][genderIndex];
    } else {
      return pronouns[randomIndex];
    }
  }

  function getRandomTense(tenses) {
    return tenses[getRandomIndex(tenses.length)];
  }

  function buildUrl(path, params) {
    const API_PREFIX = '/api';
    const url = new URL(`${API_PREFIX}${path}`, window.location.origin);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    return url;
  }

  function getFirstPerson(userConjugation) {
    return /^[a|e|h|i|o|u]/.test(userConjugation) ? "j'" : 'je';
  }

  return done ? (
    <Redirect to="/summary/" />
  ) : !infinitive ? (
    <h3>Oops, something went wrong with the server!</h3>
  ) : (
    <>
      <div className="flashcard">
        <Prompt currentTense={tense} infinitive={infinitive}>
          <ConjugationForm
            onChange={handleChange}
            onSubmit={submit}
            correct={correct}
            pronoun={
              pronoun === 'je' ? getFirstPerson(userConjugation) : pronoun
            }
            tense={tense}
            userConjugation={userConjugation}
            disabled={disabled}
          />
        </Prompt>
        <div className="correct-response">
          {correct === false ? correctResponse : ' '}
        </div>
      </div>
      <p>série: {getCurrentStreak(records)}</p>
    </>
  );
}

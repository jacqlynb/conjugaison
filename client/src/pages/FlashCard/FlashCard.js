import React, { useEffect, useState, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import {
  useConjugationHistory,
  getCorrectResponse,
  getCurrentStreak,
} from '../../utilities';
import { Prompt, ConjugationForm } from './components';
import './FlashCard.css';

export function FlashCard({ tenses, verbGroup, numPrompts }) {
  const { records, addRecord } = useConjugationHistory();
  const [infinitive, setInfinitive] = useState(null);
  const [pronoun, setPronoun] = useState(null);
  const [tense, setTense] = useState(null);
  const [userConjugation, setUserConjugation] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (promptIndex === numPrompts) {
      setDone(true);
      return;
    }

    fetchRandomVerb(verbGroup)
      .then((verb) => {
        setInfinitive(verb);
        setPronoun(getRandomPronoun());
        setPronoun(getRandomPronoun());
        setTense(getRandomTense(tenses));
        setCorrect(null);
      })
      .catch((error) => {
        console.log('Error fetching verb', error);
      });
  }, [verbGroup, tenses, promptIndex, numPrompts]);

  const correctResponse = useMemo(
    () => getCorrectResponse(records),
    [records.length]
  );

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
      setPromptIndex((previousIndex) => previousIndex + 1);
      setUserConjugation('');
      setDisabled(false);
    }, 1500);
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

async function fetchRandomVerb(verbGroup) {
  const url = buildUrl('/verb', { group: verbGroup });

  try {
    const data = await fetch(url);
    const { infinitive } = await data.json();
    return infinitive;
  } catch (error) {
    console.log('error in callApi', error);
  }
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

function getRandomPronoun() {
  const pronouns = [
    'je',
    'tu',
    ['il', 'elle'],
    'nous',
    'vous',
    ['ils', 'elles'],
  ];
  const randomIndex = Math.floor(Math.random() * pronouns.length);

  if (Array.isArray(pronouns[randomIndex])) {
    const genderIndex = Math.floor(Math.random() * 2);
    return pronouns[randomIndex][genderIndex];
  } else {
    return pronouns[randomIndex];
  }
}

function getRandomTense(tenses) {
  return tenses[Math.floor(Math.random() * tenses.length)];
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

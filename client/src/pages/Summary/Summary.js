import React from 'react';
import {
  getTotalCorrect,
  getTotalConjugations,
  useConjugationHistory,
  getBestStreak,
  storage,
} from '../../utilities';
import { CustomPieChart } from './components';
import { CustomLink } from '../../components';
import './Summary.css';

export function Summary() {
  const { records } = useConjugationHistory();

  function handleClick() {
    storage.clear();
  }

  return (
    <div>
      {/* add <Redirect to="/"> component if conjugationHistory.length !== storage.getItem('numPrompts') */}
      <CustomPieChart
        summaryCorrect={getTotalCorrect(records)}
        summaryTotalConjugations={getTotalConjugations(records)}
      />
      <p>Meilleure série: {getBestStreak(records)}</p>
      <CustomLink
        url="/"
        route=""
        linkStyle="button"
        text="Recommencez"
        onClick={handleClick}
      />
    </div>
  );
}

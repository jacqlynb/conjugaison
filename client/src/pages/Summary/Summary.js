import React from 'react';
import {
  getTotalCorrect,
  getTotalConjugations,
  useConjugationHistory,
  getBestStreak,
} from '../../utilities';
import { CustomPieChart } from './components';
import { CustomLink } from '../../components';
import './Summary.css';

export function Summary() {
  const { records } = useConjugationHistory();

  return (
    <div>
      <CustomPieChart
        summaryCorrect={getTotalCorrect(records)}
        summaryTotalConjugations={getTotalConjugations(records)}
      />
      <p>Meilleure série: {getBestStreak(records)}</p>
      <CustomLink url="/" route="" linkStyle="button" text="Recommencez" />
    </div>
  );
}

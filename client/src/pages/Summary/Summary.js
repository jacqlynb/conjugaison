import React from 'react';
import {
  getTotalCorrect,
  getTotalConjugations,
  useConjugationHistory,
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
      <CustomLink url="/" route="" linkStyle="button" text="Restart" />
    </div>
  );
}

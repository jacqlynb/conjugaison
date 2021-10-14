import React, { useContext } from 'react';

export const ConjugationHistoryContext = React.createContext({
  records: [],
  addRecord: () => {},
  clearRecords: () => {},
});

export function useConjugationHistory() {
  const conjugationHistory = useContext(ConjugationHistoryContext);

  if (conjugationHistory == null) {
    throw new Error("conjugation history doesn't exist");
  }

  return conjugationHistory;
}

export function getCurrentStreak(records) {
  let streakCounter = 0;
  const recordsReversed = [...records].reverse();
  for (let i = 0; i < recordsReversed.length; i++) {
    if (
      recordsReversed[i].userConjugation ===
      recordsReversed[i].correctConjugation
    ) {
      streakCounter = i + 1;
    } else {
      break;
    }
  }

  return streakCounter;
}

export function getBestStreak(records) {
  const allStreaks = records.reduce(
    (acc, curr) => {
      return (
        curr.userConjugation === curr.correctConjugation
          ? acc[acc.length - 1]++
          : acc.push(0),
        acc
      );
    },
    [0]
  );

  return allStreaks.reduce((acc, curr) => (curr > acc ? curr : acc), 0);
}

export function getTotalCorrect(records) {
  return records.reduce((acc, curr) => {
    return curr.userConjugation === curr.correctConjugation ? acc + 1 : acc;
  }, 0);
}

export function getTotalConjugations(records) {
  return records.length;
}

export function getCorrectResponse(records) {
  if (records.length === 0) {
    return null;
  }

  return records[records.length - 1].correctConjugation;
}

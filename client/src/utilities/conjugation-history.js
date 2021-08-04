import React, { useContext } from 'react';

export const ConjugationHistoryContext = React.createContext({
  records: [],
  addRecord: () => {},
});

export function useConjugationHistory() {
  const conjugationHistory = useContext(ConjugationHistoryContext);

  if (conjugationHistory == null) {
    throw new Error("conjugation history doesn't exist");
  }

  return conjugationHistory;
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
  console.log('history', records);
  if (records.length === 0) {
    return null;
  }

  return records[records.length - 1].correctConjugation;
}

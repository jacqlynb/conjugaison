import React from 'react';
import './Summary.css';

export function Summary(props) {
    return (
        <p>Total correct conjugations: {props.numCorrectConjugations}/{props.totalConjugations}</p>
    )
}
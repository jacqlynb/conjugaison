import React from 'react';
import {useRouteMatch} from 'react-router-dom';
import {CustomPieChart} from './components';
import {CustomLink} from '../../components';
import './Summary.css';

export function Summary(props) {
  let {url} = useRouteMatch();

  return (
    <div>
      <p className="summary__message">Total correct conjugations:</p>
      <CustomPieChart numCorrectConjugations={props.numCorrectConjugations}
                      totalConjugations={props.totalConjugations}/>
      <CustomLink url="/"
                  route=""
                  linkStyle="button" 
                  text="Restart"/>
    </div>
  )
}
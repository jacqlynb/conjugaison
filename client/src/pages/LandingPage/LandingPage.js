import React from 'react';
import {VerbTenseForm, VerbGroupForm, NumberOfPromptsForm} from './components';
import {Link, useRouteMatch} from "react-router-dom";

export function LandingPage(props) {
    let {url} = useRouteMatch();

    return (
        <div className="parameters">
            <VerbTenseForm onSelectTense={props.onSelectTense} 
                             selectedTenses={props.selectedTenses} />
            <VerbGroupForm onSelectGroup={props.onSelectGroup}
                             verbGroup={props.verbGroup} />
            <NumberOfPromptsForm onSelectNumPrompts ={props.onSelectNumPrompts}/>
            <button><Link to={`${url}flashcard`}>Commencez</Link></button>
        </div>
    );
}
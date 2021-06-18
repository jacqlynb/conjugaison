import React from 'react';
import {VerbTenseForm, VerbGroupForm} from './components';


export function LandingPage(props) {
    return (
        <div className="parameters">
            <VerbTenseForm onSelectTense={props.onSelectTense} 
                             selectedTenses={props.selectedTenses} />
            <VerbGroupForm onSelectGroup={props.onSelectGroup}
                             verbGroup={props.verbGroup} />
        </div>
    );
}
import React from 'react';
import {mount} from 'enzyme';
import {VerbTenseForm} from './VerbTenseForm';

describe('VerbTenseForm', () => {
    jest.disableAutomock();
    const mock = jest.fn();

    it('renders verb tense labels', () => {
        const verbTenseLabels = ['indicatif présent', 'imparfait', 'passé simple', 
        'futur simple', 'passé composé', 'plus-que-parfait', 'futur antérieur',
        'subjonctif présent', 'subjonctif passé', 'conditionnel présent', 
        'conditionnel passé', 'impératif'];

        const wrapper = mount(<VerbTenseForm onSelectTense={mock} 
                                             selectedTenses={'indicatif présent'} />);
        wrapper.find('label').forEach((label, i) => {
            expect(label).toHaveText(verbTenseLabels[i]);
        });
    });

    it('verb tenses passed in as prop are checked inputs', () => {
        const mockSelectedTenses = ['indicatif présent', 'passé composé'];
        const wrapper = mount(<VerbTenseForm onSelectTense={mock}       
                                             selectedTenses={mockSelectedTenses}/>);

        const checkedInputs = wrapper.find('input').filterWhere(input => {
            return (input.props().checked === true);
        });

        const checkedInputValues = checkedInputs.map(input => input.props().value);
        expect(checkedInputValues).toEqual(mockSelectedTenses);
    });

    it('passes onSelect prop to <input /> onChange', () => {
        const mock = jest.fn();
        const wrapper = mount(<VerbTenseForm onSelectTense={mock} 
                                             selectedTenses={'indicatif présent'} />);
        wrapper.find('input').forEach(input => {
            expect(input).toHaveProp('onChange', mock);
        });
    });


});

import React from 'react';
import {mount} from 'enzyme';
import {VerbTenseForm} from './VerbTenseForm';

describe('VerbTenseForm', () => {
    it("renders verb tense labels", () => {
        const verbTenseLabels = ['indicatif présent', 'imparfait', 'passé simple', 
        'futur simple', 'passé composé', 'plus-que-parfait', 'futur antérieur',
        'subjonctif présent', 'subjonctif passé', 'conditionnel présent', 
        'conditionnel passé', 'impératif'];

        const wrapper = mount(<VerbTenseForm />);
        wrapper.find('label').forEach((label, i) => {
            expect(label).toHaveText(verbTenseLabels[i]);
        });
    });

    it("selects 'indicatif present' label by default", () => {
        const wrapper = mount(<VerbTenseForm />);
        expect(wrapper.find('input').filterWhere(input => {
            return input.props().value === 'indicatif présent'
        })).toHaveProp({defaultChecked: true});
    });

    it('passes onSelect prop to <input /> onChange', () => {
        const mock = jest.fn();
        const wrapper = mount(<VerbTenseForm onSelectTense={mock} />);
        wrapper.find('input').forEach(input => {
            expect(input).toHaveProp('onChange', mock);
        });
    });
});

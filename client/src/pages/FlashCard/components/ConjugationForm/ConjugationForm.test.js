import React from 'react';
import {mount} from 'enzyme';
import {ConjugationForm} from './ConjugationForm';

it('passes onSubmit prop to <form /> onSubmit', () => {
    const mock = jest.fn();
    const wrapper = mount(<ConjugationForm onSubmit={mock} />);
    expect(wrapper.find('form')).toHaveProp('onSubmit', mock);
});

it('passes onChange prop to <input /> onChange', () => {
    const mock = jest.fn();
    const wrapper = mount(<ConjugationForm onChange={mock} />);
    expect(wrapper.find('input').filterWhere(input => input.props().type === 'text')).toHaveProp('onChange', mock);
});
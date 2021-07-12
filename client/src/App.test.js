import React from 'react';
import {mount} from 'enzyme';
import App from './App';
import {VerbTenseForm, Prompt} from './components';

it('indicatif présent is selected as default tense', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find(VerbTenseForm)).toHaveProp('selectedTenses', ['indicatif présent']);
});

// it('prompt updates when new verb tense input checked', async () => {
//   jest.spyOn(window, 'fetch').mockResolvedValue({json: () => Promise.resolve({infinitive: 'aller'})});

//   const wrapper = mount(<App />);
//   const promptWrapper = wrapper.find(Prompt);

//   const defaultCheckedInput = wrapper.find(VerbTenseForm).find('input').findWhere(input => input.props().checked).first();
//   const firstUncheckedInput = wrapper.find(VerbTenseForm).find('input').findWhere(input => !input.props().checked).first();

//   // check first unchecked input
//   firstUncheckedInput.simulate('change', {target: {value: firstUncheckedInput.props().value}});
  
//   // uncheck default checked input
//   defaultCheckedInput.simulate('change', {target: {value: defaultCheckedInput.props().value}});

//   await resolvePromises();

//   // prompt should contain updated value
//   expect(promptWrapper.text()).toContain(firstUncheckedInput.props().value);
// });

function resolvePromises() {
  return new Promise(resolve => setImmediate(resolve));
}
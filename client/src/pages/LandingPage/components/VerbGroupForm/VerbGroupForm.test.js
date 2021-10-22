import React from 'react';
import { mount } from 'enzyme';
import { VerbGroupForm } from './VerbGroupForm';

describe('VerbGroupForm', () => {
  it('renders verb group labels', () => {
    const verbGroupLabels = [
      '« er »',
      '« ir »',
      'irrégulier « ir »',
      'irrégulier « re »',
      'irrégulier « oir »',
    ];
    const wrapper = mount(<VerbGroupForm />);
    wrapper.find('label').forEach((label, i) => {
      expect(label).toHaveText(verbGroupLabels[i]);
    });
  });

  it("selects 'er' group by default", () => {
    const wrapper = mount(<VerbGroupForm />);
    expect(
      wrapper.find('input').filterWhere((input) => {
        return input.props().value === 'er';
      })
    ).toHaveProp({ defaultChecked: true });
  });

  it('passes onSelect prop to <input /> onChange', () => {
    const mock = jest.fn();
    const wrapper = mount(<VerbGroupForm onSelect={mock} />);
    wrapper.find('input').forEach((input) => {
      expect(input).toHaveProp('onChange', mock);
    });
  });
});

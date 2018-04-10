// DurationsPage.test.js0]

import React from 'react'
import { shallow } from 'enzyme'

import { DurationDetails } from './DurationDetailsPage'

const mockDurations = [
  {
    id: 1,
    key: 'guest',
    value: 'guest',
    effective_from: 'user',
    effective_to: 'guest',
    remarks: '2018-03-31'
  },
  {
    id: 2,
    key: 'og1',
    value: 'g1',
    effective_from: 'user',
    effective_to: 'owner',
    remarks: '2018-04-31'
  }
]

const mockProps = [
  {
    alert: {message: "testingAlert"},
    authzn: {
      allowsAdd: true,
      allowsEdit: true,
      allowsDelete: true,
      condition: ''
    },
    saveChanges: jest.fn(),
    error: jest.fn(),
    durations: {
      items: []
    }
  },
  {
    alert: {message: "testingAlert"},
    authzn: {
      allowsAdd: true,
      allowsEdit: true,
      allowsDelete: true,
      condition: ''
    },
    saveChanges: jest.fn(),
    error: jest.fn(),
    durations: {
      items: []
    }
  }
]
const mockLocations = [
  {
    state: {
      model: mockDurations[0],
      submitted: false,
      adding: false
    }
  },
  {
    state: {
      model: mockDurations[1],
      submitted: false,
      adding: false
    }
  }
]

const mocks = [
  {
    key: {name: 'key', value: mockDurations[0].key},
    value: {name: 'value', value: mockDurations[0].value},
    effectiveFrom: {name: 'effective_from', value: mockDurations[0].effective_from},
    effectiveTo: {name: 'effective_to', value: mockDurations[0].effective_to},
    remarks: {name: 'remarks', value: mockDurations[0].remarks}
  },
  {
    key: {name: 'key', value: mockDurations[1].key},
    value: {name: 'value', value: mockDurations[1].value},
    effectiveFrom: {name: 'effective_from', value: mockDurations[1].effective_from},
    effectiveTo: {name: 'effective_to', value: mockDurations[1].effective_to},
    remarks: {name: 'remarks', value: mockDurations[1].remarks}
  }
]

const component = shallow(<DurationDetails {...mockProps[0]} location={mockLocations[0]}/>)

describe('DurationsPage params test', () => {
  it('should render DurationsPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
  it('should have model state', () => {
    expect(component.state('model')).toBeDefined()
  })
  it('should have submitted state', () => {
    expect(component.state('submitted')).toBeDefined()
  })
  it('should have adding state', () => {
    expect(component.state('adding')).toBeDefined()
  })
})


describe('DurationDetailsPage events test 1', () => {

  it('should be called with required states as arguments', () => {
    component.find('#key').simulate('change', {target: mocks[0].key})
    component.find('#value').simulate('change', {target: mocks[0].value})
    component.find('#effectiveFrom').simulate('change', {target: mocks[0].effectiveFrom})
    component.find('#effectiveTo').simulate('change', {target: mocks[0].effectiveTo})
    component.find('#remarks').simulate('change', {target: mocks[0].remarks})
    component.find('#durationDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].saveChanges.mock.calls[0][0]).toEqual(mockDurations[0])
  })

})


const component2 = shallow(<DurationDetails {...mockProps[1]} location={mockLocations[1]}/>)
describe('DurationDetailsPage events test 2', () => {
  it('should be called with required states as arguments', () => {
    component2.find('#key').simulate('change', {target: mocks[1].key})
    component2.find('#value').simulate('change', {target: mocks[1].value})
    component2.find('#effectiveFrom').simulate('change', {target: mocks[1].effectiveFrom})
    component2.find('#effectiveTo').simulate('change', {target: mocks[1].effectiveTo})
    component2.find('#remarks').simulate('change', {target: mocks[1].remarks})
    component2.find('#durationDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[1].saveChanges.mock.calls[0][0]).toEqual(mockDurations[1])
  })
})

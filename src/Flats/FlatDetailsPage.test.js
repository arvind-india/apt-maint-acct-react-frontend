// FlatsPage.test.js0]

import React from 'react'
import { shallow } from 'enzyme'

import { FlatDetails } from './FlatDetailsPage'

const mockFlats = [
  {
    id: 1,
    block_number: '0',
    flat_number: 'g1'
  },
  {
    id: 2,
    block_number: '1',
    flat_number: 'g4'
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
    clearAlert: jest.fn(),
    saveChanges: jest.fn(),
    error: jest.fn(),
    flats: {
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
    clearAlert: jest.fn(),
    saveChanges: jest.fn(),
    error: jest.fn(),
    flats: {
      items: []
    }
  }
]
const mockLocations = [
  {
    state: {
      model: mockFlats[0],
      submitted: false,
      adding: false
    }
  },
  {
    state: {
      model: mockFlats[1],
      submitted: false,
      adding: false
    }
  }
]

const mocks = [
  {
    blockNumber: {name: 'block_number', value: mockFlats[0].block_number},
    flatNumber: {name: 'flat_number', value: mockFlats[0].flat_number}
  },
  {
    blockNumber: {name: 'block_number', value: mockFlats[1].block_number},
    flatNumber: {name: 'flat_number', value: mockFlats[1].flat_number}
  }
]

const component = shallow(<FlatDetails {...mockProps[0]} location={mockLocations[0]}/>)

describe('FlatsPage params test', () => {
  it('should render FlatsPage without crashing', () => {
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


describe('FlatDetailsPage events test 1', () => {
  it('should call clearAlert on submit and no crash', () => {
    component.find('#flatDetailsForm').simulate('submit', { preventDefault() {} })
    expect(mockProps[0].clearAlert.mock.calls.length).toEqual(1)
  })

  it('should be called with required states as arguments', () => {
    component.find('#blockNumber').simulate('change', {target: mocks[0].blockNumber})
    component.find('#flatNumber').simulate('change', {target: mocks[0].flatNumber}) // calling again to toggle from '' to 'R'
    component.find('#flatDetailsForm').simulate('submit', { preventDefault() {} })
    expect(mockProps[0].saveChanges.mock.calls[1][0]).toEqual(mockFlats[0])
  })

})


const component2 = shallow(<FlatDetails {...mockProps[1]} location={mockLocations[1]}/>)
describe('FlatDetailsPage events test 2', () => {
  it('should be called with required states as arguments', () => {
    component2.find('#blockNumber').simulate('change', {target: mocks[1].blockNumber})
    component2.find('#flatNumber').simulate('change', {target: mocks[1].flatNumber}) // calling again to toggle from '' to 'R'
    component2.find('#flatDetailsForm').simulate('submit', { preventDefault() {} })
    expect(mockProps[1].saveChanges.mock.calls[0][0]).toEqual(mockFlats[1])
  })
})

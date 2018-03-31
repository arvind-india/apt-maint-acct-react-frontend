// ResidentsPage.test.js0]

import React from 'react'
import { shallow } from 'enzyme'

import { ResidentDetails } from './ResidentDetailsPage'

const mockResidents = [
  {
    id: 1,
    owner_id: 'guest',
    first_name: 'guest',
    last_name: 'user',
    is_a: 'guest',
    occupied_on: '2018-03-31',
    vacated_on: '2020-03-31'
  },
  {
    id: 2,
    owner_id: 'og1',
    first_name: 'g1',
    last_name: 'user',
    is_a: 'owner',
    occupied_on: '2018-04-31',
    vacated_on: '2020-04-31'
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
    residents: {
      items: []
    },
    users: {
      items: [
        { name: 'guest' },
        { name: 'og1' },
        { name: 'tg1' }
      ]
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
    residents: {
      items: []
    },
    users: {
      items: [
        { name: 'guest' },
        { name: 'og1' },
        { name: 'tg1' }
      ]
    }
  }
]
const mockLocations = [
  {
    state: {
      model: mockResidents[0],
      submitted: false,
      adding: false
    }
  },
  {
    state: {
      model: mockResidents[1],
      submitted: false,
      adding: false
    }
  }
]

const mocks = [
  {
    ownerId: mockResidents[0].owner_id,
    isA: mockResidents[0].is_a,
    firstName: {name: 'first_name', value: mockResidents[0].first_name},
    lastName: {name: 'last_name', value: mockResidents[0].last_name},
    occupiedOn: {name: 'occupied_on', value: mockResidents[0].occupied_on},
    vacatedOn: {name: 'vacated_on', value: mockResidents[0].vacated_on}
  },
  {
    ownerId: mockResidents[1].owner_id,
    isA: mockResidents[1].is_a,
    firstName: {name: 'first_name', value: mockResidents[1].first_name},
    lastName: {name: 'last_name', value: mockResidents[1].last_name},
    occupiedOn: {name: 'occupied_on', value: mockResidents[1].occupied_on},
    vacatedOn: {name: 'vacated_on', value: mockResidents[1].vacated_on}  }
]

const component = shallow(<ResidentDetails {...mockProps[0]} location={mockLocations[0]}/>)

describe('ResidentsPage params test', () => {
  it('should render ResidentsPage without crashing', () => {
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


describe('ResidentDetailsPage events test 1', () => {
  it('should call clearAlert on submit and no crash', () => {
    component.find('#residentDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].clearAlert.mock.calls.length).toEqual(1)
  })

  it('should be called with required states as arguments', () => {
    component.find('#ownerId').simulate('change', mocks[0].ownerId)
    component.find('#isA').simulate('change', mocks[0].isA)
    component.find('#firstName').simulate('change', {target: mocks[0].firstName}) // calling again to toggle from '' to 'R'
    component.find('#lastName').simulate('change', {target: mocks[0].lastName})
    component.find('#occupiedOn').simulate('change', {target: mocks[0].occupiedOn})
    component.find('#vacatedOn').simulate('change', {target: mocks[0].vacatedOn})
    component.find('#residentDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].saveChanges.mock.calls[1][0]).toEqual(mockResidents[0])
  })

})


const component2 = shallow(<ResidentDetails {...mockProps[1]} location={mockLocations[1]}/>)
describe('ResidentDetailsPage events test 2', () => {
  it('should be called with required states as arguments', () => {
    component2.find('#ownerId').simulate('change', mocks[1].ownerId)
    component2.find('#isA').simulate('change', mocks[1].isA)
    component2.find('#firstName').simulate('change', {target: mocks[1].firstName}) // calling again to toggle from '' to 'R'
    component2.find('#lastName').simulate('change', {target: mocks[1].lastName})
    component2.find('#occupiedOn').simulate('change', {target: mocks[1].occupiedOn})
    component2.find('#vacatedOn').simulate('change', {target: mocks[1].vacatedOn})
    component2.find('#residentDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[1].saveChanges.mock.calls[0][0]).toEqual(mockResidents[1])
  })
})

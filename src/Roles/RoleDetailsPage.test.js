// RolesPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { RoleDetails } from './RoleDetailsPage'

const mockRoles = [
  {
    id: 1,
    name: 'admin',
    description:'administrator',
    inherits: ''
  },
  {
    id: 2,
    name: 'owner',
    description:'owner of the flat',
    inherits: 'tenant'
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
//    clearAlert: jest.fn(),
    saveChanges: jest.fn(),
    error: jest.fn(),
    roles: {
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
//    clearAlert: jest.fn(),
    saveChanges: jest.fn(),
    error: jest.fn(),
    roles: {
      items: []
    }
  }
]
const mockLocations = [
  {
    state: {
      model: mockRoles[0],
      submitted: false,
      adding: false
    }
  },
  {
    state: {
      model: mockRoles[1],
      submitted: false,
      adding: false
    }
  }
]

const mocks = [
  {
    name: {name: 'name', value: mockRoles[0].name},
    description: {name: 'description', value: mockRoles[0].description},
    inherits: mockRoles[0].inherits
  },
  {
    name: {name: 'name', value: mockRoles[1].name},
    description: {name: 'description', value: mockRoles[1].description},
    inherits: mockRoles[1].inherits
  }
]
const component = shallow(<RoleDetails {...mockProps[0]} location={mockLocations[0]}/>)

describe('RolesPage params test', () => {
  it('should render RolesPage without crashing', () => {
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

describe('RoleDetailsPage events test 1', () => {
/*  it('should call clearAlert on submit and no crash', () => {
    component.find('#roleDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].clearAlert.mock.calls.length).toEqual(1)
  }) */
  it('should be called with required states as arguments', () => {
    component.find('#name').simulate('change', {target: mocks[0].name})
    component.find('#description').simulate('change', {target: mocks[0].description})
    component.find('Select').simulate('change', mocks[0].inherits)
    component.find('#roleDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].saveChanges.mock.calls[0][0]).toEqual(mockRoles[0])
  })
})

const component2 = shallow(<RoleDetails {...mockProps[1]} location={mockLocations[1]}/>)
describe('RoleDetailsPage events test 2', () => {
  it('should be called with required states as arguments', () => {
    component2.find('#name').simulate('change', {target: mocks[1].name})
    component2.find('#description').simulate('change', {target: mocks[1].description})
    component2.find('Select').simulate('change', mocks[1].inherits)
    component2.find('#roleDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[1].saveChanges.mock.calls[0][0]).toEqual(mockRoles[1])
  })
})

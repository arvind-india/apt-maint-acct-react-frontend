// PermissionsPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { PermissionDetails } from './PermissionDetailsPage'

const mockPermissions = [
  {
    id: 1,
    operations: 'R',
    resource: 'ACCOUNT',
    condition: '',
    description:'Grands Read-only permission on ACCOUNT',
  },
  {
    id: 2,
    operations: 'RU',
    resource: 'USER',
    condition: '',
    description:'Grands Read and Edit permissions on USER',
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
    permissions: {
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
    permissions: {
      items: []
    }
  }
]
const mockLocations = [
  {
    state: {
      model: mockPermissions[0],
      submitted: false,
      adding: false
    }
  },
  {
    state: {
      model: mockPermissions[1],
      submitted: false,
      adding: false
    }
  }
]

const mocks = [
  {
    operations: {name: 'operations', value: mockPermissions[0].operations},
    resource: mockPermissions[0].resource,
    condition: {name: 'condition', value: mockPermissions[0].condition},
    description: {name: 'description', value: mockPermissions[0].description}
  },
  {
    operations: {name: 'operations', value: mockPermissions[1].operations},
    resource: mockPermissions[1].resource,
    condition: {name: 'condition', value: mockPermissions[1].condition},
    description: {name: 'description', value: mockPermissions[1].description}
  }
]
const component = shallow(<PermissionDetails {...mockProps[0]} location={mockLocations[0]}/>)

describe('PermissionsPage params test', () => {
  it('should render PermissionsPage without crashing', () => {
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

describe('PermissionDetailsPage events test 1', () => {
  it('should call clearAlert on submit and no crash', () => {
    component.find('#permissionDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].clearAlert.mock.calls.length).toEqual(1)
  })
  it('should be called with required states as arguments', () => {
    component.find('.operations [checked=true]').simulate('change', {target: mocks[0].operations}) // toggles from 'R' to ''
    component.find('#readOperations').simulate('change', {target: mocks[0].operations}) // calling again to toggle from '' to 'R'
    component.find('Select').simulate('change', mocks[0].resource)
    component.find('#condition').simulate('change', {target: mocks[0].condition})
    component.find('#description').simulate('change', {target: mocks[0].description})
    component.find('#permissionDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].saveChanges.mock.calls[1][0]).toEqual(mockPermissions[0])
  })

})

const component2 = shallow(<PermissionDetails {...mockProps[1]} location={mockLocations[1]}/>)
describe('PermissionDetailsPage events test 2', () => {
  it('should be called with required states as arguments', () => {
    // yet to explore below statement; it works!!! Even though 'Create' checkbox is searched and is simulated to 'RU' 
    component2.find('#createOperations').simulate('change', {target: mocks[1].operations})
    //component2.find('#readOperations').simulate('change', {target: mocks[1].operations})
    component2.find('Select').simulate('change', mocks[1].resource)
    component2.find('#condition').simulate('change', {target: mocks[1].condition})
    component2.find('#description').simulate('change', {target: mocks[1].description})
    component2.find('#permissionDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[1].saveChanges.mock.calls[0][0]).toEqual(mockPermissions[1])
  })
})

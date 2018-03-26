// UsersPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { UserDetails } from './UserDetailsPage'
const mockUser = {
  id: 1,
  name: 'user1',
  first_name:'user1',
  last_name: 'test',
  email: 'user1@test.com'
}

const mockProps = {
  alert: {message: "testingAlert"},
  authzn: {
    allowsAdd: true,
    allowsEdit: true,
    allowsDelete: true,
    condition: ''
  },
  clearAlert: jest.fn(),
  getById: jest.fn(),
  saveChanges: jest.fn(),
  error: jest.fn()
}
const mockLocation = {
  state: {
    model: mockUser,
    title: 'User Details',
    module: '',
    infos: [],
    password: 'secret',
    confirmPassword: 'secret',
    passwordChanged: false,
    passwordMatches: false,
    submitted: false,
    touched: false,
    adding: false,
    title: 'Mock Test: User Details'
  }
}

const mock = {
  userName: {name: 'name', value: mockUser.name},
  firstName: {name: 'first_name', value: mockUser.first_name},
  lastName: {name: 'last_name', value: mockUser.last_name},
  email: {name: 'email', value: mockUser.email }
}

const component = shallow(<UserDetails {...mockProps} location={mockLocation}/>)

describe('UsersPage params test', () => {
  it('should render UsersPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
  it('should have model state', () => {
    expect(component.state('model')).toBeDefined()
  })
  it('should have infos state', () => {
    expect(component.state('infos')).toBeDefined()
  })
  it('should have password state', () => {
    expect(component.state('password')).toBeDefined()
  })
  it('should have confirmPassword state', () => {
    expect(component.state('confirmPassword')).toBeDefined()
  })
  it('should have passwordChanged state', () => {
    expect(component.state('passwordChanged')).toBeDefined()
  })
  it('should have passwordMatches state', () => {
    expect(component.state('passwordMatches')).toBeDefined()
  })
  it('should have submitted state', () => {
    expect(component.state('submitted')).toBeDefined()
  })
  it('should have touched state', () => {
    expect(component.state('touched')).toBeDefined()
  })
  it('should have adding state', () => {
    expect(component.state('adding')).toBeDefined()
  })
  it('should have title state', () => {
    expect(component.state('title')).toBeDefined()
  })

})


describe('UserDetailsPage events test', () => {
  it('should call getById on submit and no crash', () => {
    component.find('#userDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.getById.mock.calls.length).toEqual(1)
  })
  it('should be called with required states as arguments', () => {
    component.find('#userName').simulate('change', {target: mock.userName})
    component.find('#firstName').simulate('change', {target: mock.firstName})
    component.find('#lastName').simulate('change', {target: mock.lastName})
    component.find('#email').simulate('change', {target: mock.email})
    component.find('#userDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.saveChanges.mock.calls[1][0]).toEqual(mockUser)
  })
})

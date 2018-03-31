// RegisterPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { Register } from './RegisterPage'

const mockUsers = [
  {
    //id: 1,
    name: 'user1',
    first_name:'user1',
    last_name: 'test',
    email: 'user1@test.com',
    password: 'secret',
    infos: []
  },
  {
    // id: 2,
    name: 'user2',
    first_name:'user2',
    last_name: 'test',
    email: 'user2@test.com',
    password: 'secret',
    infos: []
  }

]

const mockProps = [
  {
    alert: {message: "testingAlert"},
    register: jest.fn(),
    error: jest.fn()
  },
  {
    alert: {message: "testingAlert"},
    register: jest.fn(),
    error: jest.fn()
  }
]
const mockLocations = [
  {
    state: {
      model: mockUsers[0],
      title: 'Mock Test: Registration1',
      module: '',
      password: 'secret',
      confirmPassword: 'secret',
      submitted: false
    }
  },
  {
    state: {
      model: mockUsers[1],
      title: 'Mock Test: Registration2',
      module: '',
      password: 'secret',
      confirmPassword: 'secret',
      submitted: false
    }
  }
]

const mocks = [
  {
    userName: {name: 'name', value: mockUsers[0].name},
    firstName: {name: 'first_name', value: mockUsers[0].first_name},
    lastName: {name: 'last_name', value: mockUsers[0].last_name},
    email: {name: 'email', value: mockUsers[0].email },
    password: {name: 'password', value: mockUsers[0].password}
  },
  {
    userName: {name: 'name', value: mockUsers[1].name},
    firstName: {name: 'first_name', value: mockUsers[1].first_name},
    lastName: {name: 'last_name', value: mockUsers[1].last_name},
    email: {name: 'email', value: mockUsers[1].email },
    password: {name: 'password', value: mockUsers[1].password}
  }
]
const component = shallow(<Register {...mockProps[0]} location={mockLocations[0]}/>)

describe('UsersPage params test', () => {
  it('should render UsersPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
  it('should have model state', () => {
    expect(component.state('user')).toBeDefined()
  })
  it('should have confirmPassword state', () => {
    expect(component.state('confirmPassword')).toBeDefined()
  })
  it('should have submitted state', () => {
    expect(component.state('submitted')).toBeDefined()
  })

})


describe('RegisterPage events test1', () => {
  it('should call register on submit and no crash', () => {
    component.find('#registerForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].register.mock.calls.length).toEqual(1)
  })
  it('should be called with required states as arguments', () => {
    component.find('#userName').simulate('change', {target: mocks[0].userName})
    component.find('#firstName').simulate('change', {target: mocks[0].firstName})
    component.find('#lastName').simulate('change', {target: mocks[0].lastName})
    component.find('#email').simulate('change', {target: mocks[0].email})
    component.find('#password').simulate('change', {target: mocks[0].password})
    component.find('#registerForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].register.mock.calls[1][0]).toEqual(mockUsers[0])
  })
})


const component2 = shallow(<Register {...mockProps[1]} location={mockLocations[1]}/>)
describe('RegisterPage events test2', () => {
  it('should be called with required states as arguments', () => {
    component2.find('#userName').simulate('change', {target: mocks[1].userName})
    component2.find('#firstName').simulate('change', {target: mocks[1].firstName})
    component2.find('#lastName').simulate('change', {target: mocks[1].lastName})
    component2.find('#email').simulate('change', {target: mocks[1].email})
    component2.find('#password').simulate('change', {target: mocks[1].password})
    component2.find('#registerForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[1].register.mock.calls[0][0]).toEqual(mockUsers[1])
  })
})

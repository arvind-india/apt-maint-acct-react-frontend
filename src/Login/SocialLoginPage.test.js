// SocialLoginPage.test.js

import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer';

import { SocialLogin } from './SocialLoginPage'

const mockProps = {
  // alert: {message: "testingAlert"},
  //authentication: {loggingIn: true, user: {}},
  socialLogin: jest.fn(),  // mock function
  logout: jest.fn(), // mock function
  clearAlert: jest.fn() // mock function
}
/*
const mockStates = {
  email: 'unitTesting@jest.js',
  password: 'secret'
}
const mockEmail = {
  name: 'email',
  value: "dummy@email.id"
}
const mockPassword = {
  name: 'password',
  value: "secret"
}
const mockResult = [
  mockEmail.value,
  mockPassword.value
] */
const component = shallow(<SocialLogin {...mockProps} />)

describe('SocialLoginPage params test', () => {
  it('should render SocialLoginPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
/*  it('should have email state', () => {
    expect(component.state('email')).toBeDefined()
  })
  it('should have password state', () => {
    expect(component.state('password')).toBeDefined()
  })
  it('should set email state', () => {
    component.setState({email: mockStates.email})
    expect(component.state('email')).toEqual(mockStates.email)
  })
  it('should set password state', () => {
    component.setState({password: mockStates.password})
    expect(component.state('password')).toEqual(mockStates.password)
  }) */
})

/*
describe('SocialLoginPage events test', () => {
  it('should call mock login function', () => {
    component.find('#loginForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.login.mock.calls.length).toEqual(1)
  })
  it('should be called with the email and password in the state as arguments', () => {
    component.find('#email').simulate('change', {target: mockEmail})
    component.find('#password').simulate('change', {target: mockPassword})
    component.find('#loginForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.login.mock.calls[1]).toEqual(mockResult)
  })
})
*/

// ResetPasswordPage.test.js

import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer';

import { ResetPassword } from './ResetPasswordPage'

const mockProps = {
  alert: {message: "testingAlert"},
  // authentication: {loggingIn: true, user: {}},
  // login: jest.fn(),  // mock function
  // logout: jest.fn(), // mock function
  // clearAlert: jest.fn(), // mock function
  resetPassword: jest.fn(),
  error: jest.fn(),
  match: { params: { token: '1234'}}
}
const mockStates = {
  // email: 'unitTesting@jest.js',
  password: 'secret',
  confirmPassword: 'secret'
}
/* const mockEmail = {
  name: 'email',
  value: "dummy@email.id"
} */

const mockPassword = {
  name: 'password',
  value: "secret"
}
const mockRepeatPassword = {
  name: 'confirmPassword',
  value: "secret"
}

const mockResult = [
//  mockEmail.value,
  mockPassword.value,
  mockProps.match.params.token
]
const component = shallow(<ResetPassword {...mockProps} />)

describe('ResetPasswordPage params test', () => {
  it('should render ResetPasswordPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
/*  it('should have email state', () => {
    expect(component.state('email')).toBeDefined()
  }) */
  it('should have password state', () => {
    expect(component.state('password')).toBeDefined()
  })
  it('should have repeat password state', () => {
    expect(component.state('confirmPassword')).toBeDefined()
  })
/*  it('should set email state', () => {
    component.setState({email: mockStates.email})
    expect(component.state('email')).toEqual(mockStates.email)
  }) */
  it('should set password state', () => {
    component.setState({password: mockStates.password})
    expect(component.state('password')).toEqual(mockStates.password)
  })
  it('should set repeat password state', () => {
    component.setState({confirmPassword: mockStates.confirmPassword})
    expect(component.state('confirmPassword')).toEqual(mockStates.confirmPassword)
  })
})

describe('ResetPasswordPage events test', () => {
  it('should call mock login function', () => {
    component.find('#resetPasswordForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.resetPassword.mock.calls.length).toEqual(1)
  })
  it('should be called with the password and confirm password in the state as arguments', () => {
    // component.find('#email').simulate('change', {target: mockEmail})
    component.find('#password').simulate('change', {target: mockPassword})
    component.find('#confirmPassword').simulate('change', {target: mockRepeatPassword})
    component.find('#resetPasswordForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.resetPassword.mock.calls[1]).toEqual(mockResult)
  })
})

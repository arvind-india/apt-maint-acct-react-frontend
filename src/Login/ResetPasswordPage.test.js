// ResetPasswordPage.test.js

import React from 'react'
import { shallow } from 'enzyme'
//import renderer from 'react-test-renderer';

import { ResetPassword } from './ResetPasswordPage'

const mockProps = {
  alert: {message: "testingAlert"},
  resetPassword: jest.fn(),
  error: jest.fn(),
  match: { params: { token: '1234'}}
}
const mockStates = {
  password: 'secret',
  confirmPassword: 'secret'
}
const mockPassword = {
  name: 'password',
  value: "secret"
}
const mockConfirmPassword = {
  name: 'confirmPassword',
  value: "secret"
}

const mockResult = [
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
  it('should have password state', () => {
    expect(component.state('password')).toBeDefined()
  })
  it('should have confirm password state', () => {
    expect(component.state('confirmPassword')).toBeDefined()
  })
  it('should set password state', () => {
    component.setState({password: mockStates.password})
    expect(component.state('password')).toEqual(mockStates.password)
  })
  it('should set confirm password state', () => {
    component.setState({confirmPassword: mockStates.confirmPassword})
    expect(component.state('confirmPassword')).toEqual(mockStates.confirmPassword)
  })
})

describe('ResetPasswordPage events test', () => {
  it('should call mock resetPassword function', () => {
    component.find('#resetPasswordForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.resetPassword.mock.calls.length).toEqual(1)
  })
  it('should be called with the password and confirm password in the state as arguments', () => {
    component.find('#password').simulate('change', {target: mockPassword})
    component.find('#confirmPassword').simulate('change', {target: mockConfirmPassword})
    component.find('#resetPasswordForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.resetPassword.mock.calls[1]).toEqual(mockResult)
  })
})

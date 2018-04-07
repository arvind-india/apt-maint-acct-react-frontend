// ForgotPasswordPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { ForgotPassword } from './ForgotPasswordPage'

const mockProps = {
  alert: {message: "testingAlert"},
  logout: jest.fn(), // mock function
  clearAlert: jest.fn(), // mock function
  forgotPassword: jest.fn()
}
const mockStates = {
  email: 'unitTesting@jest.js',
}
const mockEmail = {
  name: 'email',
  value: "dummy@email.id"
}
const mockResult = [
  mockEmail.value,
]
const component = shallow(<ForgotPassword {...mockProps} />)

describe('ForgotPasswordPage params test', () => {
  it('should render ForgotPasswordPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
  it('should have email state', () => {
    expect(component.state('email')).toBeDefined()
  })
  it('should set email state', () => {
    component.setState({email: mockStates.email})
    expect(component.state('email')).toEqual(mockStates.email)
  })
})

describe('ForgotPasswordPage events test', () => {
  it('should call mock forgotPassword function', () => {
    component.find('#forgotPasswordForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.forgotPassword.mock.calls.length).toEqual(1)
  })
  it('should be called with the email in the state as arguments', () => {
    component.find('#email').simulate('change', {target: mockEmail})
    component.find('#forgotPasswordForm').simulate('submit', {preventDefault() {}})
    expect(mockProps.forgotPassword.mock.calls[1]).toEqual(mockResult)
  })
})

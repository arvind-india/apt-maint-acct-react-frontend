// SocialLoginPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { SocialLogin } from './SocialLoginPage'

const mockProps = {
  socialLogin: jest.fn(),  // mock function
  logout: jest.fn(), // mock function
  clearAlert: jest.fn() // mock function
}

const component = shallow(<SocialLogin {...mockProps} />)

describe('SocialLoginPage params test', () => {
  it('should render SocialLoginPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
})

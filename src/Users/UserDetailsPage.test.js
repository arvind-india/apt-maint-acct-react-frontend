// UsersPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { UserDetails } from './UserDetailsPage'

const mockUsers = [
  {
    id: 1,
    name: 'user1',
    first_name:'user1',
    last_name: 'test',
    email: 'user1@test.com'
  },
  {
    id: 2,
    name: 'user2',
    first_name:'user2',
    last_name: 'test',
    email: 'user2@test.com',
    infos: [
      {key: 'flatNumber', value: 'F1'},
      {key: 'residentType', value: 'owner'}
    ]
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
    getById: jest.fn(),
    saveChanges: jest.fn(),
    error: jest.fn()
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
    getById: jest.fn(),
    saveChanges: jest.fn(),
    error: jest.fn()
  }
]
const mockLocations = [
  {
    state: {
      model: mockUsers[0],
      title: 'Mock Test: User1 Details',
      module: '',
      infos: [],
      password: 'secret',
      confirmPassword: 'secret',
      passwordChanged: false,
      passwordMatches: false,
      submitted: false,
      touched: false,
      adding: false
    }
  },
  {
    state: {
      model: mockUsers[1],
      title: 'Mock Test: User2 Details',
      module: '',
      infos: [],
      password: 'secret',
      confirmPassword: 'secret',
      passwordChanged: false,
      passwordMatches: false,
      submitted: false,
      touched: false,
      adding: false
    }
  }
]

const mocks = [
  {
    userName: {name: 'name', value: mockUsers[0].name},
    firstName: {name: 'first_name', value: mockUsers[0].first_name},
    lastName: {name: 'last_name', value: mockUsers[0].last_name},
    email: {name: 'email', value: mockUsers[0].email }
  },
  {
    userName: {name: 'name', value: mockUsers[1].name},
    firstName: {name: 'first_name', value: mockUsers[1].first_name},
    lastName: {name: 'last_name', value: mockUsers[1].last_name},
    email: {name: 'email', value: mockUsers[1].email },
    infos: {
      flatNumber: {name: 'flatNumber', value: mockUsers[1].infos[0].value},
      residentType: {name: 'residentType', value: mockUsers[1].infos[1].value}
    }
  }
]
const component = shallow(<UserDetails {...mockProps[0]} location={mockLocations[0]}/>)

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


describe('UserDetailsPage with NO INFOS events test', () => {
  it('should call getById on submit and no crash', () => {
    component.find('#userDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].getById.mock.calls.length).toEqual(1)
  })
  it('should be called with required states as arguments', () => {
    component.find('#userName').simulate('change', {target: mocks[0].userName})
    component.find('#firstName').simulate('change', {target: mocks[0].firstName})
    component.find('#lastName').simulate('change', {target: mocks[0].lastName})
    component.find('#email').simulate('change', {target: mocks[0].email})
    component.find('#userDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[0].saveChanges.mock.calls[1][0]).toEqual(mockUsers[0])
  })
})

const component2 = shallow(<UserDetails {...mockProps[1]} location={mockLocations[1]}/>)
describe('UserDetailsPage with WITH INFOS events test', () => {
  it('should find checked radio input', () => {
    expect(component2.find('.residentType [checked=true]').length).toEqual(1)
  })
  it('should find checked radio input, here too', () => {
    expect(component2.find('Input[type="radio"][checked=true]').length).toEqual(1)
  })
  it('should be called with required states as arguments', () => {
    component2.find('#userName').simulate('change', {target: mocks[1].userName})
    component2.find('#firstName').simulate('change', {target: mocks[1].firstName})
    component2.find('#lastName').simulate('change', {target: mocks[1].lastName})
    component2.find('#email').simulate('change', {target: mocks[1].email})
    component2.find('#flatNumber').simulate('change', {target: mocks[1].infos.flatNumber})
    component2.find('.residentType [checked=true]').simulate('change', {target: mocks[1].infos.residentType})
    component2.find('#userDetailsForm').simulate('submit', {preventDefault() {}})
    expect(mockProps[1].saveChanges.mock.calls[0][0]).toEqual(mockUsers[1])
  })
})

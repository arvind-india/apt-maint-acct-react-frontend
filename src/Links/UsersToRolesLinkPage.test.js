// UsersToRolesLinkPage.test.js0]

import React from 'react'
import { shallow } from 'enzyme'

import { UsersToRolesLink } from './UsersToRolesLinkPage'

const mockUsers = [
  { id: 1, name: '0', first_name: 'G1', email: 'test on G1' },
  { id: 2, name: '0', first_name: 'G2', email: 'test on G2' }
]

const mockRoles = [
  { id: 1, name: 'user1', inherits: 'test', description: 'test user1' },
  { id: 2, name: 'user2', inherits: 'test', description: 'test user2' }
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
    users: { items: mockUsers },
    usersToRoles: { items: [] },
    roles: { items: mockRoles },
    getAllUsers: jest.fn(),
    getAllRoles: jest.fn(),
    getMyRoles: jest.fn(),
    updateMyRoles: jest.fn()
  }
]

const component = shallow(<UsersToRolesLink {...mockProps[0]} />)

describe('UsersToRolesLinkPage params test', () => {
  it('should render UsersPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
  it('should have model state', () => {
    expect(component.state('selectedOptionInLeftList')).toBeDefined()
  })
  it('should have model state', () => {
    expect(component.state('selectedOptionsInDList')).toBeDefined()
  })
  it('should have model state', () => {
    expect(component.state('selectedOptionsInAList')).toBeDefined()
  })
})


const selectedOptions = [mockRoles[0].id, mockRoles[1].id]

describe('UsersToRolesLinkPage test: select a user and select two roles', () => {

  component.find('#leftItem').simulate('change', {target: {name:'id', value: mockUsers[0].id}})

  it('should check options in Left List', () => {
    expect(component.state('selectedOptionInLeftList')).toEqual(mockUsers[0].id)
  })

  component
    .find('#detachedItems')
    .simulate('change', { target: {name: 'id', selectedOptions: selectedOptions} })

  it('should check options in detached list', () => {
    expect(component.state('selectedOptionsInDList'))
      .toEqual(selectedOptions)
  })

  component
    .find('#attachedItems')
    .simulate('change', { target: {name: 'id', selectedOptions: selectedOptions} })

  it('should have two options in the attached list', () => {
    expect(component.state('selectedOptionsInAList'))
      .toEqual(selectedOptions)
  })

})



const component2 = shallow(<UsersToRolesLink {...mockProps[0]} />)

describe('UsersToRolesLinkPage test: Attach selected items', () => {

  component2
    .find('#leftItem')
    .simulate('change', {target: {name:'id', value: mockUsers[0].id} })

  component2
    .find('#detachedItems')
    .simulate('change', {target: {name: 'id', selectedOptions: selectedOptions} })

  component2
    .find('Button.abutton')
    .simulate('click')

  it('should now remove two options from detached list', () => {
    expect(component2.state('selectedOptionsInDList')).toEqual([])
  })

})



const component3 = shallow(<UsersToRolesLink {...mockProps[0]} />)

describe('UsersToRolesLinkPage test: Detach selected items', () => {

  component3
    .find('#leftItem')
    .simulate('change', { target: {name:'id', value: mockUsers[0].id} })

  component3
    .find('#attachedItems')
    .simulate('change', { target: {name: 'id', selectedOptions: selectedOptions} })

  component3
    .find('Button.dbutton')
    .simulate('click')

  it('should now remove two options from attached list', () => {
    expect(component3.state('selectedOptionsInAList')).toEqual([])
  })

})

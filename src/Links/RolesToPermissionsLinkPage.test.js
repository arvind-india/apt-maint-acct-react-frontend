// RolesToPermissionsLinkPage.test.js0]

import React from 'react'
import { shallow } from 'enzyme'

import { RolesToPermissionsLink } from './RolesToPermissionsLinkPage'

const mockRoles = [
  { id: 1, name: 'guest', description: 'guest role' },
  { id: 2, name: 'tenant', description: 'tenant role' }
]

const mockPermissions = [
  { id: 1, operations: 'R', condition: '', resource: 'accounts', description: 'Read only operations on Accounts module' },
  { id: 2, operations: 'RU', condition: 'userOwnRecord', resource: 'users', description: 'Read and Update own records in Users module' }
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
    roles: { items: mockRoles },
    rolesToPermissions: { items: [] },
    permissions: { items: mockPermissions },
    getAllRoles: jest.fn(),
    getAllPermissions: jest.fn(),
    getMyPermissions: jest.fn(),
    updateMyPermissions: jest.fn()
  }
]

const component = shallow(<RolesToPermissionsLink {...mockProps[0]} />)

describe('RolesToPermissionsLinkPage params test', () => {
  it('should render RolesPage without crashing', () => {
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


const selectedOptions = [mockPermissions[0].id, mockPermissions[1].id]

describe('RolesToPermissionsLinkPage test: select a role and select two permissions', () => {

  component.find('#leftItem').simulate('change', {target: {name:'id', value: mockRoles[0].id}})

  it('should check options in Left List', () => {
    expect(component.state('selectedOptionInLeftList')).toEqual(mockRoles[0].id)
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


const component2 = shallow(<RolesToPermissionsLink {...mockProps[0]} />)

describe('RolesToPermissionsLinkPage test: Attach selected items', () => {

  component2
    .find('#leftItem')
    .simulate('change', {target: {name:'id', value: mockRoles[0].id} })

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



const component3 = shallow(<RolesToPermissionsLink {...mockProps[0]} />)

describe('RolesToPermissionsLinkPage test: Detach selected items', () => {

  component3
    .find('#leftItem')
    .simulate('change', { target: {name:'id', value: mockRoles[0].id} })

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

// PermissionsPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { Permissions } from './PermissionsPage'

const mockProps = {
  trackHistory: false,  // for unit testing history is NOT required as it has 'keys' that are dynamic
  permissions: {
    loading: false,
    error: false,
    items: [
      {
        id: 1,
        operations: 'R',
        resource: 'ACCOUNT',
        conditions: '',
        description:'Grands Read-only permission on ACCOUNT',
      },
      {
        id: 2,
        operations: 'RU',
        resource: 'ACCOUNT',
        conditions: '',
        description:'Grands Read and Edit permissions on ACCOUNT',
      },
      {
        id: 3,
        operations: 'CRUD',
        resource: 'ACCOUNT',
        conditions: '',
        description:'Grands All permissions on ACCOUNT',
      }
    ]
  },
  alert: {message: "testingAlert"},
  authzn: {
    allowsAdd: true,
    allowsEdit: true,
    allowsDelete: true,
    condition: ''
  },
  getAll: jest.fn(),
  delete: jest.fn()
}

const component = shallow(<Permissions {...mockProps} />)

describe('PermissionsPage params test', () => {
  it('should render PermissionsPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
})

describe('PermissionsPage rows test', () => {
  let numberOfMockPermissions = mockProps.permissions.items.length
  let tbody = component.find('tbody')
  let rows = tbody.find('tr')
  it('should have '+numberOfMockPermissions+' rows', () => {
    expect(rows.length).toEqual(numberOfMockPermissions)
  })

})

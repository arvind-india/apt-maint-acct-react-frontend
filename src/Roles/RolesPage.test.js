// RolesPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { Roles } from './RolesPage'

const mockProps = {
  trackHistory: false,  // for unit testing history is NOT required as it has 'keys' that are dynamic
  roles: {
    loading: false,
    error: false,
    items: [
      {
        id: 1,
        name: 'admin',
        description:'administrator with all access',
        inherits: ''
      },
      {
        id: 2,
        name: 'supervisor',
        description:'supervisor with limited access compared to administrator',
        inherits: ''
      },
      {
        id: 3,
        name: 'owner',
        description:'Owner can access own records for editing purpose',
        inherits: 'tenant'
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

const component = shallow(<Roles {...mockProps} />)

describe('RolesPage params test', () => {
  it('should render RolesPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
})

describe('RolesPage rows test', () => {
  let numberOfMockRoles = mockProps.roles.items.length
  let tbody = component.find('tbody')
  let rows = tbody.find('tr')
  it('should have '+numberOfMockRoles+' rows', () => {
    expect(rows.length).toEqual(numberOfMockRoles)
  })

})

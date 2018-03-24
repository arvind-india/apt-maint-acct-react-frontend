// UsersPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { Users } from './UsersPage'

const mockProps = {
  trackHistory: false,  // for unit testing history is NOT required as it has 'keys' that are dynamic
  users: {
    loading: false,
    error: false,
    items: [
      {
        id: 1,
        name: 'user1',
        first_name:'user1',
        last_name: 'test',
        email: 'user1@test.com',
        infos: []
      },
      {
        id: 2,
        name: 'user2',
        first_name:'user2',
        last_name: 'test',
        email: 'user2@test.com',
        infos: []
      },
      {
        id: 3,
        name: 'user3',
        first_name:'user3',
        last_name: 'test',
        email: 'user3@test.com',
        infos: []
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

const component = shallow(<Users {...mockProps} />)

describe('UsersPage params test', () => {
  it('should render UsersPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    //expect(component.getElements()).toMatchSnapshot()
    expect(component.find('Table')).toMatchSnapshot()
  })
})

describe('UsersPage rows test', () => {
  let numberOfMockUsers = mockProps.users.items.length
  it('should have '+numberOfMockUsers+' rows', () => {
    let tbody = component.find('tbody')
    let rows = tbody.find('tr')
    expect(rows.length).toEqual(numberOfMockUsers)
  })
})

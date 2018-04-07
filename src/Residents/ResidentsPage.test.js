// ResidentsPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { Residents } from './ResidentsPage'

const mockProps = {
  trackHistory: false,  // for unit testing history is NOT required as it has 'keys' that are dynamic
  residents: {
    loading: false,
    error: false,
    items: [
      {
        id: 1,
        name: 'guest',
        firstName: 'guest',
        lastName: 'user',
        residentType: 'guest',
        occupiedOn: '2018-03-31',
        vacatedOn: '2020-03-31'
      },
      {
        id: 2,
        name: 'og1',
        firstName: 'g1',
        lastName: 'user',
        residentType: 'owner',
        occupiedOn: '2018-04-31',
        vacatedOn: '2020-04-31'
      },
      {
        id: 3,
        name: 'tg1',
        firstName: 't1',
        lastName: 'user',
        residentType: 'tenant',
        occupiedOn: '2018-05-31',
        vacatedOn: '2020-05-31'
      }
    ]
  },
  users: {
    items: [
      { name: 'guest' },
      { name: 'og1' },
      { name: 'tg1' }
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
  getAllUser: jest.fn(),
  delete: jest.fn()
}

const component = shallow(<Residents {...mockProps} />)

describe('ResidentsPage params test', () => {
  it('should render ResidentsPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
})

describe('ResidentsPage rows test', () => {
  let numberOfMockResidents = mockProps.residents.items.length
  let tbody = component.find('tbody')
  let rows = tbody.find('tr')
  it('should have '+numberOfMockResidents+' rows', () => {
    expect(rows.length).toEqual(numberOfMockResidents)
  })
})

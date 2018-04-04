// AccountsPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { Accounts } from './AccountsPage'

const mockProps = {
  trackHistory: false,  // for unit testing history is NOT required as it has 'keys' that are dynamic
  accounts: {
    loading: false,
    error: false,
    items: [
      {
        id: 1,
        recorded_at: '2018-04-04',
        item: 'maintenance fee',
        flat_number: 'G1',
        name: 'tester',
        for_month: '04',
        for_year: '2018',
        crdr: 'cr',
        amount: '600',
        balance: '',
        category: 'maintenance',
        remarks: 'maintenance for the month april 2018'
      },
      {
        id: 2,
        recorded_at: '2018-04-01',
        item: 'sewage clearance',
        flat_number: 'NA',
        name: 'Sewage Truck Service',
        for_month: '04',
        for_year: '2018',
        crdr: 'dr',
        amount: '2200',
        balance: '',
        category: 'sewage disposal',
        remarks: 'septic tank clearance'      },
      {
        id: 3,
        recorded_at: '2018-03-31',
        item: 'Garbage clearance',
        flat_number: 'NA',
        name: 'Panchayat Garbage disposal Service',
        for_month: '04',
        for_year: '2018',
        crdr: 'dr',
        amount: '200',
        balance: '',
        category: 'maintenance',
        remarks: 'Garbage clearance'
      }
    ]
  },
  users: {
    items: []
  },
  alert: {message: "testingAlert"},
  authzn: {
    allowsAdd: true,
    allowsEdit: true,
    allowsDelete: true,
    condition: ''
  },
  getAll: jest.fn(),
  delete: jest.fn(),
  getListFor: jest.fn(),
  setSessionStorage: jest.fn()
}

const component = shallow(<Accounts {...mockProps} />)

describe('AccountsPage params test', () => {
  it('should render AccountsPage without crashing', () => {
    component
  })

  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
})

describe('AccountsPage rows test', () => {
  let numberOfMockAccounts = mockProps.accounts.items.length
  let tbody = component.find('tbody')
  let rows = tbody.find('tr')
  it('should have '+numberOfMockAccounts+' rows', () => {
    expect(rows.length).toEqual(numberOfMockAccounts)
  })
})

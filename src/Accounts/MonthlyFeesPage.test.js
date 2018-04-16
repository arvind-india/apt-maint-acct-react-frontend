// MonthlyFeesPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { MonthlyFees } from './MonthlyFeesPage'

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
  flats: {
    items: []
  },
  alert: {message: "testingAlert"},
  authzn: {
    allowsAdd: true,
    allowsEdit: true,
    allowsDelete: true,
    condition: ''
  },
  getAllFlats: jest.fn(),
  delete: jest.fn(),
  getMonthlyAccountsFor: jest.fn(),
  getActive: jest.fn(),
  saveChanges: jest.fn()
}

const component = shallow(<MonthlyFees {...mockProps} />)

describe('MonthlyFeesPage params test', () => {
  it('should render MonthlyFeesPage without crashing', () => {
    component
  })

  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
})

/*
describe('MonthlyFeesPage rows test', () => {
  let numberOfMockMonthlyFees = mockProps.accounts.items.length
  let tbody = component.find('tbody')
  let rows = tbody.find('tr')
  it('should have '+numberOfMockMonthlyFees+' rows', () => {
    expect(rows.length).toEqual(numberOfMockMonthlyFees)
  })
})
*/

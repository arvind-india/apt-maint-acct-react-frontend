// AccountsPage.test.js0]

import React from 'react'
import { shallow } from 'enzyme'

import { AccountDetails } from './AccountDetailsPage'

const mockAccounts = [
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
    remarks: 'septic tank clearance'
  }
]
const mockFlats = [
  {id: 1, flat_number: 'G1'},
  {id: 2, flat_number: 'G2'}
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
    getAllFlats: jest.fn(),
//    clearAlert: jest.fn(),
    saveChanges: jest.fn(),
    error: jest.fn(),
    accounts: {
      items: mockAccounts
    },
    flats: {
      items: mockFlats
    }
  }
]
const mockLocations = [
  {
    state: {
      model: mockAccounts[0],
      submitted: false,
      adding: false
    }
  },
  {
    state: {
      model: mockAccounts[1],
      submitted: false,
      adding: false
    }
  }
]

const mocks = [
  {
    recorded_at: {name: 'recorded_at', value: mockAccounts[0].recorded_at},
    item: {name: 'item', value: mockAccounts[0].item},
    category: mockAccounts[0].category,
    flat_number: mockAccounts[0].flat_number,
    name: {name: 'name', value: mockAccounts[0].name},
    for_month: mockAccounts[0].for_month,
    for_year: {name: 'for_year', value: mockAccounts[0].for_year},
    crdr: {name: 'crdr', value: mockAccounts[0].crdr},
    amount: {name: 'amount', value: mockAccounts[0].amount},
    balance: {name: 'balance', value: mockAccounts[0].balance},

    remarks: {name: 'remarks', value: mockAccounts[0].remarks}
  }
]

const component = shallow(<AccountDetails {...mockProps[0]} location={mockLocations[0]}/>)

describe('AccountsPage params test', () => {
  it('should render AccountsPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
  it('should have model state', () => {
    expect(component.state('model')).toBeDefined()
  })
  it('should have submitted state', () => {
    expect(component.state('submitted')).toBeDefined()
  })
  it('should have adding state', () => {
    expect(component.state('adding')).toBeDefined()
  })
})


describe('AccountDetailsPage events test 1', () => {
/*  it('should call clearAlert on submit and no crash', () => {
    component.find('#accountDetailsForm').simulate('submit', { preventDefault() {} })
    expect(mockProps[0].clearAlert.mock.calls.length).toEqual(1)
  }) */

  it('should be called with required states as arguments', () => {
    component.find('#recorded_at').simulate('change', {target: mocks[0].recorded_at})
    component.find('#item').simulate('change', {target: mocks[0].item})
    component.find('#flat_number').simulate('change', mocks[0].flat_number)
    component.find('#name').simulate('change', {target: mocks[0].name})
    component.find('#for_month').simulate('change', mocks[0].for_month)
    component.find('#for_year').simulate('change', {target: mocks[0].for_year})
    component.find('.crdr [checked=true]').simulate('change', {target: mocks[0].crdr})
    component.find('#amount').simulate('change', {target: mocks[0].amount})
    component.find('#category').simulate('change', mocks[0].category)
    component.find('#remarks').simulate('change', {target: mocks[0].remarks})
    component.find('#accountDetailsForm').simulate('submit', { preventDefault() {} })
    expect(mockProps[0].saveChanges.mock.calls[0][0]).toEqual(mockAccounts[0])
  })


})

/*
const component2 = shallow(<AccountDetails {...mockProps[1]} location={mockLocations[1]}/>)
describe('AccountDetailsPage events test 2', () => {
  it('should be called with required states as arguments', () => {
    component2.find('#blockNumber').simulate('change', {target: mocks[1].blockNumber})
    component2.find('#accountNumber').simulate('change', {target: mocks[1].accountNumber}) // calling again to toggle from '' to 'R'
    component2.find('#accountDetailsForm').simulate('submit', { preventDefault() {} })
    expect(mockProps[1].saveChanges.mock.calls[0][0]).toEqual(mockAccounts[1])
  })
})
*/

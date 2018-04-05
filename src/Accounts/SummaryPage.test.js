// SummaryPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { Summary } from './SummaryPage'
const mockSummaries = [
  {
    id: 1,
    yr_mo: '2018-04',
    cr: 100,
    dr: 0,
    diff: 100,
    cumulativeDiff: 100
  },
  {
    id: 2,
    yr_mo: '2018-04',
    cr: 100,
    dr: 0,
    diff: 100,
    cumulativeDiff: 200
  },
  {
    id: 3,
    yr_mo: '2018-04',
    cr: 0,
    dr: 50,
    diff: -50,
    cumulativeDiff: 150
  },
]
const mockProps = {
  summaries: {
    items: mockSummaries
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
  getSummaryList: jest.fn()
}

const component = shallow(<Summary {...mockProps} />)

describe('SummaryPage params test', () => {
  it('should render SummaryPage without crashing', () => {
    component
  })

  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
})

describe('SummaryPage rows test', () => {
  let numberOfMockSummary = mockProps.summaries.items.length
  let tbody = component.find('tbody')
  let rows = tbody.find('tr')
  it('should have '+numberOfMockSummary+' rows', () => {
    expect(rows.length).toEqual(numberOfMockSummary)
  })
})

// DurationsPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { Durations } from './DurationsPage'

const mockProps = {
  trackHistory: false,  // for unit testing history is NOT required as it has 'keys' that are dynamic
  durations: {
    loading: false,
    error: false,
    items: [
      {
        id: 1,
        key: 'guest',
        value: 'guest',
        effectiveFrom: '2018-03-31',
        effectiveTo: '2020-03-31',
        remarks: 'testing'
      },
      {
        id: 2,
        key: 'og1',
        value: 'g1',
        effectiveFrom: '2018-04-31',
        effectiveTo: '2020-04-31',
        remarks: 'testing'
      },
      {
        id: 3,
        key: 'tg1',
        value: 't1',
        effectiveFrom: '2018-05-31',
        effectiveTo: '2020-05-31',
        remarks: 'testing'
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

const component = shallow(<Durations {...mockProps} />)

describe('DurationsPage params test', () => {
  it('should render DurationsPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
})

describe('DurationsPage rows test', () => {
  let numberOfMockDurations = mockProps.durations.items.length
  let tbody = component.find('tbody')
  let rows = tbody.find('tr')
  it('should have '+numberOfMockDurations+' rows', () => {
    expect(rows.length).toEqual(numberOfMockDurations)
  })
})

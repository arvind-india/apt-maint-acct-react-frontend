// FlatsPage.test.js

import React from 'react'
import { shallow } from 'enzyme'

import { Flats } from './FlatsPage'

const mockProps = {
  trackHistory: false,  // for unit testing history is NOT required as it has 'keys' that are dynamic
  flats: {
    loading: false,
    error: false,
    items: [
      {
        id: 1,
        block_number: '0',
        flat_number: 'g1'
      },
      {
        id: 2,
        block_number: '0',
        flat_number: 'f1'
      },
      {
        id: 3,
        block_number: '1',
        flat_number: 'g4'      }
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

const component = shallow(<Flats {...mockProps} />)

describe('FlatsPage params test', () => {
  it('should render FlatsPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
})


describe('FlatsPage rows test', () => {
  let numberOfMockFlats = mockProps.flats.items.length
  let tbody = component.find('tbody')
  let rows = tbody.find('tr')
  it('should have '+numberOfMockFlats+' rows', () => {
    expect(rows.length).toEqual(numberOfMockFlats)
  })

})

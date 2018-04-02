// FlatsToResidentsLinkPage.test.js0]

import React from 'react'
import { shallow } from 'enzyme'

import { FlatsToResidentsLink } from './FlatsToResidentsLinkPage'

const mockFlats = [
  { id: 1, block_number: '0', flat_number: 'G1', remarks: 'test on G1' },
  { id: 2, block_number: '0', flat_number: 'G2', remarks: 'test on G2' }
]

const mockResidents = [
  { id: 1, first_name: 'user1', last_name: 'test', is_a: 'owner', remark: 'test user1' },
  { id: 2, first_name: 'user2', last_name: 'test', is_a: 'owner', remark: 'test user2' }
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
    flats: { items: mockFlats },
    flatsToResidents: { items: [] },
    residents: { items: mockResidents },
    getAllFlats: jest.fn(),
    getAllResidents: jest.fn(),
    getMyResidents: jest.fn(),
    updateMyResidents: jest.fn()
  },
  {
    alert: {message: "testingAlert"},
    authzn: {
      allowsAdd: true,
      allowsEdit: true,
      allowsDelete: true,
      condition: ''
    },
    getAllFlats: jest.fn(),
    getAllResidents: jest.fn(),
    getMyResidents: jest.fn(),
    updateMyResidents: jest.fn()
  }
]

const component = shallow(<FlatsToResidentsLink {...mockProps[0]} />)

describe('FlatsToResidentsLinkPage params test', () => {
  it('should render FlatsPage without crashing', () => {
    component
  })
  it('should render initial layout', () => {
    expect(component.getElements()).toMatchSnapshot()
  })
  it('should have model state', () => {
    expect(component.state('selectedOptionInLeftList')).toBeDefined()
  })
  it('should have model state', () => {
    expect(component.state('selectedOptionsInDList')).toBeDefined()
  })
  it('should have model state', () => {
    expect(component.state('selectedOptionsInAList')).toBeDefined()
  })
})

describe('FlatsToResidentsLinkPage test on selections, attach, and detach', () => {

  component.find('#leftItem').simulate('change', {target: {name:'id', value: mockFlats[0].id}})

  it('should check options in Left List', () => {
    expect(component.state('selectedOptionInLeftList')).toEqual(mockFlats[0].id)
  })

  component
    .find('#detachedItems')
    .simulate('change', {
                          target: {
                            name: 'id',
                            selectedOptions: [mockResidents[0].id, mockResidents[1].id]
                          }
                        }
    )
  it('should check options in detached list', () => {
    expect(component.state('selectedOptionsInDList'))
      .toEqual([mockResidents[0].id, mockResidents[1].id])
  })
})

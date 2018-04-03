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


const selectedOptions = [mockResidents[0].id, mockResidents[1].id]

describe('FlatsToResidentsLinkPage test: select a flat and select two residents', () => {

  component.find('#leftItem').simulate('change', {target: {name:'id', value: mockFlats[0].id}})

  it('should check options in Left List', () => {
    expect(component.state('selectedOptionInLeftList')).toEqual(mockFlats[0].id)
  })

  component
    .find('#detachedItems')
    .simulate('change', {
                          target: {
                            name: 'id',
                            selectedOptions: selectedOptions
                          }
                        })

  it('should check options in detached list', () => {
    expect(component.state('selectedOptionsInDList'))
      .toEqual(selectedOptions)
  })

})



const component2 = shallow(<FlatsToResidentsLink {...mockProps[0]} />)

describe('FlatsToResidentsLinkPage test: Attach selected items', () => {

  component2
    .find('#leftItem')
    .simulate('change', {target: {name:'id', value: mockFlats[0].id} })

  component2
    .find('#detachedItems')
    .simulate('change', {target: {name: 'id', selectedOptions: selectedOptions} })

  const dList = component2.state('selectedOptionsInDList')

  it('should have two options in the detached list', () => {
    expect(dList).toEqual(selectedOptions)
  })

  component2
    .find('Button.abutton')
    .simulate('click')

  it('should now remove two options from detached list', () => {
    expect(component2.state('selectedOptionsInDList')).toEqual([])
  })

})



const component3 = shallow(<FlatsToResidentsLink {...mockProps[0]} />)

describe('FlatsToResidentsLinkPage test: Detach selected items', () => {

  component3
    .find('#leftItem')
    .simulate('change', { target: {name:'id', value: mockFlats[0].id} })

  component3
    .find('#attachedItems')
    .simulate('change', { target: {name: 'id', selectedOptions: selectedOptions} })

  const aList = component3.state('selectedOptionsInAList')

  it('should have two options in the attached list', () => {
    expect(aList).toEqual(selectedOptions)
  })

  component3
    .find('Button.dbutton')
    .simulate('click')

  it('should now remove two options from attached list', () => {
    expect(component3.state('selectedOptionsInAList')).toEqual([])
  })

})

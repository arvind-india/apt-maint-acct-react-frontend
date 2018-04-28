import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap'

import { durationActions, flatActions, accountMonthlyActions as actions } from '../_actions'
//import { default as MonthlyAccount } from './MonthlyAccount'

import {
  MdAdd,
  MdVisibility,
  MdEdit,
  MdDelete
} from 'react-icons/lib/md' // material design icons

import {
  Button,
  Input,
  Label
} from 'reactstrap'

import './MonthlyAccounts.css'

let url = '/accounts'
let module = 'accounts'

export class MonthlyAccounts extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      forMonth: 4,
      forYear: 2018,
      flatsToAccounts: []
    }
    //this.flatsToAccounts = []
  }
  componentDidMount() {
    this.getMonthlyList()
    this.props.getAllFlats()
  }
  getMonthlyList() {
    const { forMonth, forYear } = this.state
    let data = {
      month: forMonth,
      year: forYear
    }
    this.props.getMonthlyListFor(data)
    this.flatsToAccts()
  }
  render() {
    const { flats } = this.props
    return <div>
              <h3>Monthly Maintenance Fees Collection</h3>
              { flats && flats.items && this.showList() }
           </div>
  }
  flatsToAccts() {
    const { flats, accounts } = this.props
    let result = {}
    let acct = {}
    let flatNum = null
    flats && flats.items && flats.items.forEach((flat) => {
      flatNum = flat.flat_number
      acct = accounts && accounts.items && accounts.items.find((each) => each.flat_number === flatNum)
      result[flatNum] = acct ? acct : this.newAccount(flatNum)
    })
    this.setState({ flatsToAccounts: result })
  }
  newAccount(flatNumber) {
    return {
      id: 0,
      recorded_at: new Date().toISOString().substr(0,10),
      item: 'Monthly Maintenance Fee',
      flat_number: flatNumber,
      name: flatNumber+' Resident',
      for_month: this.state.forMonth,
      for_year: this.state.forYear,
      crdr: 'cr',
      amount: '600',
      balance: '',
      category: 'Monthly Maintenance',
      remarks: 'Paid monthly maintenance'
    }
  }

  showList(){
    const { flats } = this.props
    let models = flats
    console.log('flats: .............', flats)
    return <Table>
      <thead>{ this.headerRow() }</thead>
      <tbody>
        { models.items.map((model, index) => this.bodyRow(model,index)) }
      </tbody>
    </Table>
  }

  headerRow() {
    return <tr>
      <th>#</th>
      <th>Flat#</th>
      <th>Paid?</th>
      <th>Paid-Date</th>
      <th>Actions</th>
    </tr>
  }

  bodyRow(model,index) {
    let flatNum = model.flat_number
    let acct = this.state.flatsToAccounts[flatNum]
    return <tr key={model.id}>
      <td>{index+1}</td>
      <td>{model.flat_number}</td>
      <td>{acct && acct.id > 0?'PAID':'x'}</td>
      <td>{acct && acct.id > 0?acct.recorded_at:''}</td>
      {acct && this.showActions(acct)}
    </tr>
  }

  showActions(model) {
    const { authzn } = this.props
/*    let title = authzn && authzn.allowsAdd && model.id === 0 ? 'Add' :
                  authzn && authzn.allowsEdit && model.id > 0 ? 'Edit' :
                  'View'
    let icon = authzn && authzn.allowsAdd && model.id === 0 ? <MdAdd/> :
                  authzn && authzn.allowsEdit && model.id > 0 ? <MdEdit/> :
                <MdVisibility/> */
    return <td>
            {authzn && authzn.allowsAdd && model.id === 0 && <Button
              color="link"
              title="Add"
              onClick={() => this.handleAddModel(model)}
              ><MdAdd color="blue"/></Button>}
            {authzn && authzn.allowsDelete && model.id > 0 && <Button
              color="link"
              title="Revert Payment"
              onClick={() => this.handleDeleteModel(model)}
            ><MdDelete color="red"/></Button>}
          </td>
  }
  /*
  <Link
    to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
    title={title}
  >{icon}</Link>

  */
  handleAddModel(model) {
    if(window.confirm('Are you sure to add this payment?')) {
      this.props.saveChanges(model)
      this.getMonthlyList()
    }
  }
  handleDeleteModel(model) {
    if( window.confirm('Are you sure to remove this payment?') ) {
      this.props.delete(model)
      this.getMonthlyList()
    }
  }

} // end of class MonthlyAccounts

function mapStateToProps(state) {
  const { alert, authorizations, flats, accountsMonthly } = state
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  const accounts = accountsMonthly
  return {
    accounts,
    alert,
    authzn,
    flats,
    trackHistory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllFlats: () => {
      dispatch(flatActions.getAll())
    },
    getMonthlyListFor: (data) => {
      dispatch(actions.getMonthlyListFor(data))
    },
    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    },
    delete: (model) => {
      dispatch(actions.delete(model))
    },
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyAccounts)
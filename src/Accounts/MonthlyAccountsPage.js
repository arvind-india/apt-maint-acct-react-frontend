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
      forYear: 2018
    }
  }
  componentDidMount() {
    const { forMonth, forYear } = this.state
    let data = {
      month: forMonth,
      year: forYear
    }
    this.props.getMonthlyAccountsFor(data)
    this.props.getAllFlats()
  }
  render() {
    const { flats, accounts } = this.props
    let flatsToAccts = {}
    let acct = {}
    let data = {}
    flats && flats.items && flats.items.forEach((flat) => {
      acct = accounts && accounts.items && accounts.items.find((each) => each.flat_number === flat.flat_number)
      if(acct) {
        flatsToAccts[flat.flat_number] = acct
      } else {
        data = {
          flatNumber: flat.flat_number,
          forMonth: this.state.forMonth,
          forYear: this.state.forYear
        }
        flatsToAccts[flat.flat_number] = this.newAccount(data)
      }
    })
    return <div>
              <h3>Monthly Maintenance Fees Collection</h3>
              { flats && flats.items && this.showList(flatsToAccts) }
           </div>
  }

  newAccount(data) {
    return {
      id: 0,
      recorded_at: new Date().toISOString().substr(0,10),
      item: 'Monthly Maintenance Fee',
      flat_number: data.flatNumber,
      name: data.flatNumber+' Resident',
      for_month: data.forMonth,
      for_year: data.forYear,
      crdr: 'cr',
      amount: '600',
      balance: '',
      category: 'Monthly Maintenance',
      remarks: 'Paid monthly maintenance'
    }
  }

  showList(f2a){
    const { flats } = this.props
    let models = flats
    console.log('f2a: ', f2a)
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
      <th>Actions</th>
    </tr>
  }

  bodyRow(model,index) {
    return <tr key={model.id}>
      <td>{index+1}</td>
      <td>{model.flat_number}</td>
      {this.showActions(model)}
    </tr>
  }

  showActions(model) {
    const { authzn } = this.props
    return <td>
            <Link
              to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
              title={authzn && authzn.allowsEdit?"Edit":"View"}
            >{authzn && authzn.allowsEdit?<MdEdit/>:<MdVisibility/>}</Link>
            <Button
              color="link"
              title="Delete"
              onClick={() => this.handleDeleteModel(model.id)}
              hidden={authzn && !authzn.allowsDelete}
            ><MdDelete color="red"/></Button>
          </td>
  }

  handleDeleteModel(id) {
    const { fromDate, toDate } = this.state
    if( window.confirm('Are you sure?') ) {
      //this.props.delete(id)
      //this.props.getListFor(fromDate, toDate)
    }
  }

} // end of class MonthlyAccounts

function mapStateToProps(state) {
  const { alert, authorizations, flats, accounts } = state
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
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
    getMonthlyAccountsFor: (data) => {
      dispatch(actions.getMonthlyListFor(data))
    },
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyAccounts)

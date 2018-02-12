import React from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
// import { Router } from 'react-router-dom'
/*
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
*/
// import { history } from '../_helpers'
import { FlashMessage } from '../_components'
import { accountActions as actions, userActions } from '../_actions'
// import { AccountDetailsPage as detailsPage } from './AccountDetailsPage'
// import { DEFAULTS } from '../_constants'

// let url = '/accounts-summary'
//let module = 'accounts'

class SummaryPage extends React.Component {
/*
  constructor(props) {
    super(props)
  }
*/
  componentDidMount() {
    this.props.dispatch(actions.getSummaryList())
    this.props.dispatch(userActions.getAll())
  }

  render() {
    const { summaries, alert, users } = this.props
    let models = summaries
    return (
      <div>
        <h3>Accounts Summary</h3>
        {alert.message && <FlashMessage text={alert.message} delay={5000}/>}
        {models.items && users.items && this.showList() }
      </div>
    )
  }

  showList(){
    const { summaries } = this.props
    let models = summaries
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
      <th>Year-Month</th>
      <th>Collections</th>
      <th>Expenses</th>
      <th>Difference</th>
      <th>Cumulative Difference</th>
    </tr>
  }

  bodyRow(model,index) {
    return <tr key={model.id}>
      <td>{index+1}</td>
      <td>{model.yr_mo}</td>
      <td>{model.cr}</td>
      <td>{model.dr}</td>
      <td>{model.diff}</td>
      <td>{model.cumulativeDiff}</td>
    </tr>
  }


}

function mapStateToProps(state) {
  const { summaries, alert, authorizations, users } = state
  // const { user } = authentication
//  const authzn = authorizations[module]
  return {
//    user,
    summaries,
    alert,
//    authzn,
    users
  }
}

const connectedSummaryPage = connect(mapStateToProps)(SummaryPage)
export { connectedSummaryPage as SummaryPage }

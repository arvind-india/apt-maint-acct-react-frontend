import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'

import { FlashMessage } from '../_components'
import { accountActions as actions } from '../_actions'

export class MyAccounts extends React.Component {

  componentDidMount() {
    this.props.getMyAccounts()
  }

  render() {
    const { accounts, alert } = this.props
    let models = accounts
    return <div>
      <h3>My Accounts</h3>
      {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
      { !models && <div className="missingMessage">No Records found</div>}
      { models && models.items && this.showList() }
    </div>
  }

  showList() {
    const { accounts } = this.props
    let models = accounts
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
      <th>Category</th>
      <th>Amt in &#8377;</th>
      <th>Txn Date</th>
      <th>Name</th>
      <th>Mth</th>
      <th>Yr</th>
      <th>Flat#</th>
      <th>Remarks</th>
    </tr>
  }

  bodyRow(model,index) {
    return <tr key={model.id}>
        <td>{index+1}</td>
        <td>{model.category}</td>
        <td>{model.amount}</td>
        <td>{model.recorded_at}</td>
        <td>{model.name}</td>
        <td>{model.for_month}</td>
        <td>{model.for_year}</td>
        <td>{model.flat_number}</td>
        <td>{model.remarks}</td>
      </tr>
  }

}

function mapStateToProps(state) {
  const { accounts, alert } = state
  return {
    accounts,
    alert
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getMyAccounts: () => {
      dispatch(actions.getMyAccounts())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccounts)

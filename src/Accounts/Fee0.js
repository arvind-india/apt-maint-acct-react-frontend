import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button,
  Input
} from 'reactstrap'

import {
  accountActions as actions,
  durationActions
} from '../_actions'
import './Fee.css'

let url = '/accounts'
let module = 'accounts'

export class Fee extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        editDate: false,
        account: this.props.account
      }
      // this.handleChange = this.handleChange.bind(this)
      this.handleDateChange = this.handleDateChange.bind(this)
    }

    render() {
      const { account } = this.props
      return <div className="fee">
        { account && this.showFlatNumber() }
        { account && this.showPaidStatus() }
        { account && this.showPaidDate() }
      </div>
    }
    showFlatNumber() {
      const { authzn, flatNumber, account } = this.props
      let title = authzn.allowsAdd && account.id === 0 ? 'Add' :
        authzn.allowsEdit ? 'Edit' : 'View'
      let link = <Link
        to={{ pathname: `${url}/${account.id}`, state:{account: account} }}
        title={title}
        className="flat-number"
        >{flatNumber}</Link>

      return authzn.allowsAdd || authzn.allowsEdit || authzn.allowsView ?
        link : <span>{flatNumber}</span>
    }
    showPaidStatus() {
      const { authzn } = this.props
      const { account } = this.state
      let status = account.id > 0 ? <span>&#10004; Paid</span> : <span>x</span>

      let style = authzn.allowsAdd || authzn.allowsEdit ?
                    { cursor: "pointer" } :
                    { cursor: "default" }
      return <div
        className="payment"
        role="button"
        onClick={() => this.togglePayment()}
        style={style}
        >{status}</div>
    }
    togglePayment() {
      const { authzn, flatNumber } = this.props
      const { account } = this.state
      if(!authzn.allowsAdd && !authzn.allowsEdit) {
        return null // no authorization for add or edit, then do nothing, just return
      }
      //let cancelMsg = 'Confirm Cancel: ' + flatNumber
      //let paidMsg = 'Confirm Payment: ' + flatNumber
      //if(account.id > 0 && window.confirm(cancelMsg)) {
      if(account.id > 0) {
        //this.props.delete(account.id)
        //this.props.refresh()
        this.props.onDelete()
      } else {
        this.props.onPayment()
      }
/*      if(account.id === 0 && window.confirm(paidMsg)) {
        this.props.saveChanges(account)
        this.props.refresh()
      } */
    }
    showPaidDate() {
      const { editDate } = this.state
      return editDate ?
        this.showDateField() :
        this.showDate()
    }
    showDate() {
      const { authzn } = this.props
      const { account } = this.state
      let style = authzn.allowsAdd || authzn.allowsEdit ?
        { cursor: "pointer" } :
        { cursor: "default" }
      let clickFunction = () =>
        authzn.allowsAdd || authzn.allowsEdit ?
          this.setState({editDate: true}) : null;
      return <div
          className="paid-date"
          role="button"
          onClick={clickFunction}
          style={style}
        >{account.recorded_at}</div>
    }
    showDateField() {
      const { account } = this.state
      return <div className="paid-date">
        <Input
          id="recordedAt"
          type="date"
          name="recorded_at"
          value={account.recorded_at}
          onChange={this.handleDateChange}
        />
        <Button
          size="sm"
          color="danger"
          title="Cancel"
          onClick={() => this.setState({editDate: false})}
        >x</Button>
      </div>
    }
/*    handleChange(event) {
      const { name, value } = event.target
      this.setState({
        [name]: value
      })
    } */
    handleDateChange(event) {
      const { name, value } = event.target
      const { account } = this.props
      this.setState({
        account: {
          ...account,
          [name]: value},
        editDate: false
      })
      if(account.id > 0) { // update date on existing account whose id is greater than 0
        //this.props.saveChanges(account)
        this.props.onUpdate(account)
      }
    }
} // end of MonthlyFee class


function mapStateToProps(state) {
  const { alert, authorizations } = state
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  return {
    alert,
    authzn,
    trackHistory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    },
    delete: (id) => {
      dispatch(actions.delete(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fee)

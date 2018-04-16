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
import './MonthlyFeePage.css'

let url = '/accounts'
let module = 'accounts'

export class Fee extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        editDate: false,
        recorded_at: this.props.account.recorded_at
      }
      this.handleChange = this.handleChange.bind(this)
      this.handleDateChange = this.handleDateChange.bind(this)
    }

    render() {
      return <div className="fee">
        { this.showFlatNumber() }
        { this.showPaidStatus() }
        { this.showPaidDate() }
      </div>
    }
    showFlatNumber() {
      const { authzn, flat, flatNumber, account } = this.props
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
      const { authzn, account } = this.props
      let status = account.id > 0 ? <span>&#10004; Paid</span> : <span>x</span>

      let style = authzn.allowsAdd || authzn.allowsEdit ?
                    { cursor: "pointer" } :
                    { cursor: "default" }
      return <div
        className="payment"
        role="button"
        onClick={() => this.toggleRemittance()}
        style={style}
        >{status}</div>
    }
    toggleRemittance() {
      const { authzn, flatNumber, account } = this.props
      if(!authzn.allowsAdd && !authzn.allowsEdit) {
        return null // no authorization for add or edit, then do nothing, just return
      }
      let cancelMsg = 'Confirm Cancel: ' + flatNumber
      let remitMsg = 'Confirm Remittance: ' + flatNumber
      if(account.id > 0 && window.confirm(cancelMsg)) {
        this.props.cancel(flatNumber)
      }
      if(account.id === 0 && window.confirm(remitMsg)) {
        this.props.remit(flatNumber)
      }
    }
    showPaidDate() {
      const { editDate } = this.state
      return editDate ?
        this.showDateField() :
        this.showDate()
    }
    showDate() {
      const { authzn } = this.props
      const { recorded_at } = this.state
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
        >{recorded_at}</div>
    }
    showDateField() {
      const { recorded_at } = this.state
      return <div className="paid-date">
        <Input
          id="recordedAt"
          type="date"
          name="recorded_at"
          value={recorded_at}
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
      const { flatNumber } = this.props
      this.setState({
        [name]: value,
        editDate: false
      })
      this.props.paidOn(value, flatNumber)
    }
} // end of MonthlyFee class

/*
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
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    },
    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    },
    delete: (id) => {
      dispatch(actions.delete(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fee)
*/

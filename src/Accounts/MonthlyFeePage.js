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

export class MonthlyFee extends React.Component {
    constructor(props) {
      const { flat, account } = props
      super(props)
      let today = new Date()
      this.payNow = today.toISOString().substr(0,10)
      //let date = flat && flat.recorded_at ? flat.recorded_at : this.payNow
      //let acct = account ? account : this.newAccount()
      this.state = {
        editDate: false,
        paid: account.id > 0,
        paidOn: account.recorded_at,
        model: account
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
      const { authzn, flat } = this.props
      const { model } = this.state
      //let model = accountModel ? accountModel : this.newModel(flat.flat_number)
      //let model = account
      let title = authzn.allowsAdd && model.id === 0 ? 'Add' :
        authzn.allowsEdit ? 'Edit' : 'View'
      return <Link
        to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
        title={title}
        className="flat-number"
        >{flat.flat_number}</Link>
    }
    showPaidStatus() {
      const { model } = this.state
      let status = model.id > 0 ? <span>&#10004; Paid</span> : <span>x</span>
      return <div
        className="payment"
        role="button"
        onClick={() => this.toggleRemittance()}
        >{status}</div>
    }
    toggleRemittance() {
      const { authzn } = this.props
      const { model } = this.state
      if(!authzn.allowsAdd && !authzn.allowsEdit) {
        return null // no authorization for add or edit, then do nothing, just return
      }
      if (model.id > 0) {
        if (window.confirm('Confirm REMOVAL of PAID status')) {
          console.log('Removal confirmed')
          this.props.delete(model.id)
        }
      } else {
        if (window.confirm('Confirm ADDITION of PAID status')) {
          console.log('Addition confimed')
          this.props.saveChanges(model)
        }
      }
    }
    showPaidDate() {
      const { editDate } = this.state
      return editDate ?
        this.showDateField() :
        this.showDate()
    }
    showDate() {
      const { model } = this.state
      return <div
          className="paid-date"
          role="button"
          onClick={() => this.setState({editDate: true})}
        >{model.recorded_at}</div>
    }
    showDateField() {
      const { model } = this.state
      return <div className="paid-date">
        <Input
          id="recordedAt"
          type="date"
          name="recorded_at"
          value={model.recorded_at}
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
    handleChange(event) {
      const { name, value } = event.target
      this.setState({
        [name]: value
      })
    }
    handleDateChange(event) {
      const { name, value } = event.target
      const { model } = this.state
      this.setState({
        model: {
          ...model,
          [name]: value
        }
      })
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

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyFee)

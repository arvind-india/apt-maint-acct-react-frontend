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
      //let today = new Date()
      //this.payNow = today.toISOString().substr(0,10)
      //let date = flat && flat.recorded_at ? flat.recorded_at : this.payNow
      //let acct = account ? account : this.newAccount()
      this.state = {
        editDate: false,
        //paid: account.id > 0,
        //paidOn: account.recorded_at,
        //model: account && account.id > 0 ? account : this.initAccount(account)
        model: account
      }
      this.handleChange = this.handleChange.bind(this)
      this.handleDateChange = this.handleDateChange.bind(this)
    }
/*
    initAccount(account) {
      return a
        account :
        {
          id: account.id || 0,
          recorded_at: account.recorded_at || new Date().toISOString().substr(0,10),
          item: account.item || 'Monthly Maintenance Fee',
          flat_number: account.flat_number,
          name: account.name || account.flat_number+' Resident',
          for_month: account.for_month,
          for_year: account.for_year,
          crdr: account.crdr || 'cr',
          amount: account.amount || '600',
          balance: account.balance || '',
          category: account.category || 'Monthly Maintenance',
          remarks: account.remarks || 'Remitting monthly maintenance'
        }
    }
*/
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
      let link = <Link
        to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
        title={title}
        className="flat-number"
        >{flat.flat_number}</Link>

      return authzn.allowsAdd || authzn.allowsEdit || authzn.allowsView ?
        link : <span>{flat.flat_number}</span>
    }
    showPaidStatus() {
      const { model } = this.state
      const { authzn } = this.props
      let status = model.id > 0 ? <span>&#10004; Paid</span> : <span>x</span>

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
      const { authzn } = this.props
      const { model } = this.state
      if(!authzn.allowsAdd && !authzn.allowsEdit) {
        return null // no authorization for add or edit, then do nothing, just return
      }
/*      model.id > 0 ?
        window.confirm('Confirm Cancel: '+model.flat_number) ?
          this.props.delete(model.id) :
          null :
        window.confirm('Confirm Remittance: '+model.flat_number) ?
          this.props.saveChanges(model) :
          null
      this.props.feeChanged() */
      let cancelMsg = 'Confirm Cancel: ' + model.flat_number
      let remitMsg = 'Confirm Remittance: ' + model.flat_number
      if(model.id > 0 && window.confirm(cancelMsg)) {
        this.props.delete(model.id)
        this.props.feeChanged()
      }
      if(model.id === 0 && window.confirm(remitMsg)) {
        this.props.saveChanges(model)
        this.props.feeChanged()
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
      const { authzn } = this.props
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
          [name]: value },
        editDate: false
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

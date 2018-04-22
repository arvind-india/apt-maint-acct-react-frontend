import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button,
  Input
} from 'reactstrap'

import {
  accountMonthlyActions as actions,
  durationActions
} from '../_actions'
import './Fee.css'

let url = '/accounts'
let module = 'accounts'

export class Fee extends React.Component {
    constructor(props) {
      super(props)
      const { location } = this.props
      this.state = {
        editDate: false,
        account: location.state.model
/*        account: {
          ...this.props
        } */
      }
      console.log('Fee >> account: ', this.state.account)
      this.handleDateChange = this.handleDateChange.bind(this)
    }
/*    componentDidMount() {
      const { data } = this.props
      this.props.getAccount(data)
    } */
    render() {
      const { account } = this.state
      return <div className="fee">
        { account && this.showFlatNumber() }
        { account && this.showPaidStatus() }
        { account && this.showPaidDate() }
      </div>
    }
    showFlatNumber() {
      const { authzn } = this.props
      const { account } = this.state
      let title = authzn.allowsAdd && account.id === 0 ? 'Add' :
        authzn.allowsEdit ? 'Edit' : 'View'
      let link = <Link
        to={{ pathname: `${url}/${account.id}`, state:{model: account} }}
        title={title}
        className="flat-number"
        >{account.flat_number}</Link>

      return authzn.allowsAdd || authzn.allowsEdit || authzn.allowsView ?
        link : <span>{account.flat_number}</span>
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
      const { authzn, accountsMonthly } = this.props
      const { account } = this.state
      if(!authzn.allowsAdd && !authzn.allowsEdit) {
        return null // no authorization for add or edit, then do nothing, just return
      }
      let data = {
        model: account
      }
      if(account.id > 0) {
        this.props.delete(data)
        if(accountsMonthly.model) {
          console.log('FEE PAGE: deleted model successfully...')
          this.setState({
            account: accountsMonthly.model
          })
        } else {
          console.log('FEE PAGE: error in deletion...')
        }
      } else {
        this.props.saveChangesAndGet(data)
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

    handleDateChange(event) {
      const { name, value } = event.target
      const { account } = this.props
      this.setState({
        account: {
          ...account,
          [name]: value
        },
        editDate: false
      })
      if(account.id > 0) { // update date on existing account whose id is greater than 0
        //this.props.saveChanges(account)
        let data = {
          model: account
        }
        this.props.saveChangesAndGet(data)
      }
    }
} // end of MonthlyFee class

function mapStateToProps(state) {
  const { accountsMonthly, authorizations } = state
  const authzn = authorizations[module]
  return {
    accountsMonthly,
    authzn
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAccount: (data) => {
      dispatch(actions.getModelFor(data))
    },
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    },
/*    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    }, */
    saveChangesAndGet: (data) => {
      dispatch(actions.saveChangesAndGet(data))
    },
    delete: (data) => {
      dispatch(actions.delete(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fee)

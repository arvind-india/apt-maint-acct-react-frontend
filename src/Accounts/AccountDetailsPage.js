import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select';

import {
    Form,
    Button,
//    FormGroup,
    FormText,
    Input,
    Label,
} from 'reactstrap'

import { accountActions as actions, alertActions,userActions } from '../_actions'
import { RESIDENT_TYPES } from '../_constants'

let module = 'accounts' // module name

class AccountDetailsPage extends React.Component {

  constructor(props) {
    super(props)
    const { dispatch, match, location } = props
    let model = location.state.model // model supplied from list page
//    let ops = model.operations?model.operations:''
    let initializeModel = {
      id: model.id,
      recorded_at: model.recorded_at,
      item: model.item,
      flat_number: model.flat_number,
      name: model.name,
      for_month: model.for_month,
      for_year: model.for_year,
      crdr: model.crdr,
      amount: model.amount,
      balance: model.balance,
      category: model.category,
      remarks: model.remarks
    }
    this.state = {
      model: initializeModel,           // model to edit
      submitted: false,
      adding: match.params.id === "0"
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    dispatch(alertActions.clear())  // clear alert messages from other pages
  }

  componentDidMount() {
    this.props.dispatch(userActions.getAll())
  }

  canBeSaved() { // check for changes in model, if changes present, it can save
    const { model } = this.state

    if (!model.recorded_at) return false
    if (!model.item) return false
    if (!model.flat_number) return false
    if (!model.name) return false
    if (!model.for_month) return false
    if (!model.for_year) return false
    if (!model.crdr) return false
    if (!model.amount) return false
    if (!model.category) return false

    return true // can save changes
  }

  render() {
    const { alert, users } = this.props
    return (
      <div>
        <h2>Account Details</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        {users.items && this.show()}
      </div>
    )
  }
  show(){
    const { adding } = this.state
    const { authzn } = this.props
    let title = adding?'Add':authzn.allowsEdit?'Edit':'View'
    return <Form onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>{title}</legend>
        <div data-row-span="2">
          {this.showRecordedAt()}
          {this.showItem()}
        </div>
        <div data-row-span="1">
          {this.showCategory()}
        </div>
        <div data-row-span="2">
          {this.showFlatNumber()}
          {this.showName()}
        </div>
        <div data-row-span="4">
          {this.showMonth()}
          {this.showYear()}
          {this.showAmount()}
          {this.showCrdr()}
        </div>
        <div data-row-span="1">
          {this.showRemarks()}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary" hidden={!authzn.allowsEdit}>Save</Button>
      <Button color="link"><Link to="/accounts">Cancel</Link></Button>
    </Form>
  }

  handleSubmit(event) {
    const { model } = this.state
    const { dispatch } = this.props

    event.preventDefault()
    this.setState({ submitted: true })

    if ( this.changedProps().length === 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if(this.canBeSaved()){
console.log('Account model to be saved: ', model)
      dispatch(actions.saveChanges(model))
    } else {
      dispatch(alertActions.error('Missing data'))
    }
  }

  changedProps() {
    const { model } = this.state
    const { location } = this.props
    let modelDB = location.state.model
    let props = []

    // check for changes in model props
    for(const prop in model) {
      if( prop === 'id') continue // exclude 'id' from comparision
      if(modelDB[prop] !== model[prop]) { // if data is changed wrt data in database
        props.push(prop)
      }
    }
    return props;
  }

  showUserName() {
    const { submitted, model } = this.state
    const { users } = this.props
    return <div data-field-span="1">
				<Label>User Name</Label>
        <Select
          name="form-field-name"
          value={model.owner_id}
          multi={false}
          joinValues={false}
          simpleValue={true}
          placeholder="Select User name..."
          onChange={this.handleUserNameChange}
          valueKey="id"
          labelKey="name"
          options={users.items}
        />
        {submitted && !model.owner_id
          && <FormText color="danger">User Name is required</FormText>}
			</div>
  }
  handleUserNameChange(selectedOption) {
    const { model } = this.state
    this.setState({
      model: {
        ...model,
        owner_id: selectedOption
      }
    })
  }
  showFirstName() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>First Name</Label>
        <Input
          type="text"
          name="first_name"
          value={model.first_name}
          placeholder="First Name here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.first_name
          && <FormText color="danger">First Name is required</FormText>}
			</div>
  }

  handleChange(event) {
    const { name, value } = event.target
    const { model } = this.state
    this.setState({
        model: {
          ...model,
          [name]: value
        }
    })
  }

  showLastName() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Last Name</Label>
        <Input
          type="text"
          name="last_name"
          value={model.last_name}
          placeholder="Last Name here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.last_name
          && <FormText color="danger">Last Name is required</FormText>}
			</div>
  }
  showAccountTypeIsA() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Account Type</Label>
        <Select
          name="form-field-name"
          value={model.is_a}
          multi={false}
          joinValues={false}
          simpleValue={true}
          placeholder="Select Account Type..."
          onChange={this.handleAccountTypeChange}
          valueKey="name"
          labelKey="label"
          options={RESIDENT_TYPES}
        />
        {submitted && !model.is_a
          && <FormText color="danger">Account Type is required</FormText>}
			</div>
  }
  handleAccountTypeChange(selectedOption) {
    const { model } = this.state
    this.setState({
      model: {
        ...model,
        is_a: selectedOption
      }
    })
  }

  showOccupiedOn() {
    const { model } = this.state
    return <div data-field-span="1">
				<Label>Occupied On</Label>
        <Input
          type="date"
          name="occupied_on"
          value={model.occupied_on}
          placeholder="Date of occupation of premise"
          className="inputField"
          onChange={this.handleChange}
        />
			</div>
  }
  showVacatedOn() {
    const { model } = this.state
    return <div data-field-span="1">
				<Label>Vacated On</Label>
        <Input
          type="date"
          name="vacated_on"
          value={model.vacated_on}
          placeholder="Date of vacation of premise"
          className="inputField"
          onChange={this.handleChange}
        />
			</div>
  }

}

function mapStateToProps(state) {
  const { alert, authorizations, users } = state
//  const { user } = authentication
  const authzn = authorizations[module]
  return {
//    user,
    alert,
    authzn,
    users
  }
}

const connectedDetailsPage = connect(mapStateToProps)(AccountDetailsPage)
export { connectedDetailsPage as AccountDetailsPage }

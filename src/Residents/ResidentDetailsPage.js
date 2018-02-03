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

import { residentActions as actions, alertActions,userActions } from '../_actions'
import { RESIDENT_TYPES } from '../_constants'

let module = 'residents' // module name

class ResidentDetailsPage extends React.Component {

  constructor(props) {
    super(props)
    const { dispatch, match, location } = props
    let model = location.state.model // model supplied from list page
//    let ops = model.operations?model.operations:''
    let initializeModel = {
      id: model.id,
      owner_id: model.owner_id,
      first_name: model.first_name,
      last_name: model.last_name,
      is_a: model.is_a,
      occupied_on: model.occupied_on,
      vacated_on: model.vacated_on
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

  handleSubmit(event) {
    const { model } = this.state
    const { dispatch } = this.props

    event.preventDefault()
    this.setState({ submitted: true })

    if ( this.changedProps().length === 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if(this.canBeSaved()){
      dispatch(actions.saveChanges(model))
    } else {
      dispatch(alertActions.error('Missing data'))
    }
  }

  canBeSaved() { // check for changes in model, if changes present, it can save
    const { model } = this.state
    if (!model.owner_id) return false
    if (!model.first_name) return false
    if (!model.last_name) return false
    if (!model.is_a) return false
    return true // can save changes
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
  render() {
    const { alert, users } = this.props
    return (
      <div>
        <h2>Resident Details</h2>
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
          {this.showUserName()}
          {this.showResidentTypeIsA()}
        </div>
        <div data-row-span="2">
          {this.showFirstName()}
          {this.showLastName()}
        </div>
        <div data-row-span="2">
          {this.showOccupiedOn()}
          {this.showVacatedOn()}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary" hidden={!authzn.allowsEdit}>Save</Button>
      <Button color="link"><Link to="/residents">Cancel</Link></Button>
    </Form>
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
  showResidentTypeIsA() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Resident Type</Label>
        <Select
          name="form-field-name"
          value={model.is_a}
          multi={false}
          joinValues={false}
          simpleValue={true}
          placeholder="Select Resident Type..."
          onChange={this.handleResidentTypeChange}
          valueKey="name"
          labelKey="label"
          options={RESIDENT_TYPES}
        />
        {submitted && !model.is_a
          && <FormText color="danger">Resident Type is required</FormText>}
			</div>
  }
  handleResidentTypeChange(selectedOption) {
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
          type="text"
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
          type="text"
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

const connectedDetailsPage = connect(mapStateToProps)(ResidentDetailsPage)
export { connectedDetailsPage as ResidentDetailsPage }

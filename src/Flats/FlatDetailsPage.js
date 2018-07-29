import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import {
    Form,
    Button,
    FormText,
    Input,
    Label,
} from 'reactstrap'

import { flatActions as actions, alertActions } from '../_actions'
import { FlashMessage } from '../_components'

let module = 'flats' // module name

export class FlatDetails extends React.Component {

  constructor(props) {
    super(props)
    const { location } = props
    let model = location.state.model // model supplied from list page
    let initializeModel = {
      id: model.id,
      block_number: model.block_number,
      flat_number: model.flat_number,
      max_owners: model.max_owners,
      max_tenants: model.max_tenants
    }
    this.state = {
      model: initializeModel,           // model to edit
      submitted: false,
      adding: model.id === 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    const { model } = this.state
    event.preventDefault()
    this.setState({ submitted: true })
    this.props.saveChanges(model)
  }

  canBeSaved() { // check for changes in mModel, if changes present, it can save
    const { model } = this.state
    if (!model.block_number) return false // no block_number selected, if so, cannot save changes
    if (!model.flat_number) return false // no flat_number entered, if so, cannot save changes
    return true // can save changes
  }
  changedProps() {
    const { model } = this.state
    const { location } = this.props
    let modelDB = location.state.model
    let props = []

    // check for changes in mModel props
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
    const { alert } = this.props
    return (
      <div>
        <h2>Flat Details</h2>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        {this.validateForm()}
        {this.show()}
      </div>
    )
  }
  validateForm() {
    if ( this.changedProps().length === 0 ) {
      this.validationMsg = 'No changes to save'
      this.formValid = false
      return null
    }
    if( this.canBeSaved() ) {
      this.validationMsg = 'Save Changes'
      this.formValid = true
      return null
    }
    // finally, if reached here
    this.validationMsg = 'Missing "Required Data"...'
    this.formValid = false
  }
  show(){
    const { adding } = this.state
    const { authzn } = this.props
    let title = adding?'Add':authzn.allowsEdit?'Edit':'View'
    return <Form id="flatDetailsForm" onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>{title}</legend>
        <div data-row-span="2">
          { this.showBlockNumber() }
          { this.showFlatNumber() }
        </div>
        <div data-row-span="2">
          { this.showMaxOwners() }
          { this.showMaxTenants() }
        </div>
      </fieldset>
      <br/>
      <Button
        type="submit"
        color="primary"
        disabled={!this.formValid}
        hidden={!authzn.allowsEdit}
        title={this.validationMsg}
        >Save</Button>
      <Button
        color="link"
        ><Link
          to="/flats"
          className="text-danger"
          title="Go to Flats"
          >Cancel</Link></Button>
    </Form>
  }
  showBlockNumber() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Block Number</Label>
        <Input
          id="blockNumber"
          type="text"
          name="block_number"
          value={model.block_number}
          placeholder="<block number here>"
          title="Block Number"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.block_number
          && <FormText color="danger">Block Number is required</FormText>}
			</div>
  }
  showFlatNumber() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Flat Number</Label>
        <Input
          id="flatNumber"
          type="text"
          name="flat_number"
          value={model.flat_number}
          placeholder="Description here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.flat_number
          && <FormText color="danger">Flat Number is required</FormText>}
			</div>
  }
  showMaxOwners() {
    const { model } = this.state
    return <div data-field-span="1">
      <Label>Max.Owners</Label>
      <Input
        id="maxOwners"
        type="number"
        name="max_owners"
        value={model.max_owners}
        placeholder="Max.no.of owners of this flat need online access"
        className="inputField"
        min="0"
        max="4"
        onChange={this.handleChange}
      />
    </div>
  }
  showMaxTenants() {
    const { model } = this.state
    return <div data-field-span="1">
      <Label>Max.Tenants</Label>
      <Input
        id="maxTenants"
        type="number"
        name="max_tenants"
        value={model.max_tenants}
        placeholder="Max.no.of tenants of this flat need online access"
        className="inputField"
        min="0"
        max="4"
        onChange={this.handleChange}
      />
    </div>
  }
}

function mapStateToProps(state) {
  const { alert, authorizations } = state
  const authzn = authorizations[module]
  return {
    alert,
    authzn
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    },
    error: (msg) => {
      dispatch(alertActions.error(msg))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlatDetails)

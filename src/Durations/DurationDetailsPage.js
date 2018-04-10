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

import { durationActions as actions, alertActions } from '../_actions'
import { FlashMessage } from '../_components'

let module = 'durations' // module name

export class DurationDetails extends React.Component {

  constructor(props) {
    super(props)
    const { location } = props
    let model = location.state.model // model supplied from list page
    let initializeModel = {
      id: model.id,
      key: model.key,
      value: model.value,
      effective_from: model.effective_from,
      effective_to: model.effective_to,
      remarks: model.remarks
    }
    this.state = {
      model: initializeModel, // model to edit
      submitted: false,
      adding: model.id === 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  canBeSaved() { // check for changes in model, if changes present, it can save
    const { model } = this.state
    if (!model.key) return false
    if (!model.value) return false
    if (!model.effective_from) return false
    if (!model.effective_to) return false
    return true // can save changes
  }

  render() {
    const { alert } = this.props
    return (
      <div>
        <h2>Duration Details</h2>
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
    return <Form id="durationDetailsForm" onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>{title}</legend>
        <div data-row-span="2">
          {this.showKey()}
          {this.showValue()}
        </div>
        <div data-row-span="2">
          {this.showEffectiveFrom()}
          {this.showEffectiveTo()}
        </div>
        <div data-row-span="1">
          {this.showRemarks()}
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
          to="/durations"
          className="text-danger"
          title="Go to Durations"
          >Cancel</Link></Button>
    </Form>
  }

  handleSubmit(event) {
    const { model } = this.state
    event.preventDefault()
    this.setState({ submitted: true })
    this.props.saveChanges(model)
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

  showKey() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Key</Label>
        <Input
          id="key"
          type="text"
          name="key"
          value={model.key}
          placeholder="Key string here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.key
          && <FormText color="danger">Key is required</FormText>}
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

  showValue() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Value</Label>
        <Input
          id="value"
          type="text"
          name="value"
          value={model.value}
          placeholder="Value string here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.value
          && <FormText color="danger">Value is required</FormText>}
			</div>
  }

  showEffectiveFrom() {
    const { model } = this.state
    return <div data-field-span="1">
				<Label>Effective From Date</Label>
        <Input
          id="effectiveFrom"
          type="date"
          name="effective_from"
          value={model.effective_from}
          placeholder="Effective Start Date of Key and its Value"
          className="inputField"
          onChange={this.handleChange}
        />
			</div>
  }
  showEffectiveTo() {
    const { model } = this.state
    return <div data-field-span="1">
				<Label>Effective To Date</Label>
        <Input
          id="effectiveTo"
          type="date"
          name="effective_to"
          value={model.effective_to}
          placeholder="Effective End Date of Key and its Value"
          className="inputField"
          onChange={this.handleChange}
        />
			</div>
  }

  showRemarks() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Remarks</Label>
        <Input
          id="remarks"
          type="text"
          name="remarks"
          value={model.remarks}
          placeholder="Remarks string here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.remarks
          && <FormText color="danger">Remarks is required</FormText>}
			</div>
  }

}

function mapStateToProps(state) {
  const { alert, authorizations, users } = state
  const authzn = authorizations[module]
  return {
    alert,
    authzn,
    users
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

export default connect(mapStateToProps, mapDispatchToProps)(DurationDetails)

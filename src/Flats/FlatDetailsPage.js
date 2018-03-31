import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
//import Select from 'react-select';

import {
    Form,
    Button,
//    FormGroup,
    FormText,
    Input,
    Label,
} from 'reactstrap'

import { flatActions as actions, alertActions } from '../_actions'
//import { MODULES } from '../_constants'

let module = 'flats' // module name

export class FlatDetails extends React.Component {

  constructor(props) {
    super(props)
    const { location } = props
    let model = location.state.model // model supplied from list page
//    let ops = model.operations?model.operations:''
    let initializeModel = {
      id: model.id,
      block_number: model.block_number,
      flat_number: model.flat_number
    }
    this.state = {
      model: initializeModel,           // model to edit
      submitted: false,
      adding: model.id === "0"
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    //dispatch(alertActions.clear())  // clear alert messages from other pages
    this.props.clearAlert()
  }
  handleSubmit(event) {
    const { model } = this.state
    //const { dispatch } = this.props

    event.preventDefault()
    this.setState({ submitted: true })
    this.props.saveChanges(model)

/*    if ( this.changedProps().length === 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if(this.canBeSaved()){
      dispatch(actions.saveChanges(model))
    } else {
      dispatch(alertActions.error('Missing data'))
    } */
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
    //console.log('event target: ', event.target)
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
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
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
          {this.showBlockNumber()}
          {this.showFlatNumber()}
        </div>
      </fieldset>
      <br/>
      <Button
        type="submit"
        color="primary"
        disabled={!this.formValid}
        hidden={!authzn.allowsEdit}
        title="Save changes"
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
          name="blockNumber"
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
          name="flatNumber"
          value={model.flat_number}
          placeholder="Description here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.flat_number
          && <FormText color="danger">Flat Number is required</FormText>}
			</div>
  }
}

function mapStateToProps(state) {
  const { alert, authorizations } = state
//  const { user } = authentication
  const authzn = authorizations[module]
  return {
//    user,
    alert,
    authzn
  }
}

function mapDispatchToProps(dispatch) {
  return {
    clearAlert: () => {
      dispatch(alertActions.clear())
    },
    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    },
    error: (msg) => {
      dispatch(alertActions.error(msg))
    }
  }
}

//const connectedDetailsPage = connect(mapStateToProps)(FlatDetailsPage)
//export { connectedDetailsPage as FlatDetailsPage }
export default connect(mapStateToProps, mapDispatchToProps)(FlatDetails)

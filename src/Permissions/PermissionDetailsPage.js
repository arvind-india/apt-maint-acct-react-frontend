import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select';

import {
    Form,
    Button,
    FormGroup,
    FormText,
    Input,
    Label,
} from 'reactstrap'

import { permissionActions as actions, alertActions } from '../_actions'
import { MODULES } from '../_constants'

let module = 'permissions' // module name

class PermissionDetailsPage extends React.Component {

  constructor(props) {
    super(props)
    const { dispatch, match, location } = props
    let model = location.state.model // model supplied from list page
    let ops = model.operations?model.operations:''
    let initializeModel = {
      id: model.id,
      operations: model.operations,
      resource: model.resource,
      condition: model.condition?model.condition:'', // optional field can be null, so initialize with '' if null
      description: model.description
    }
    this.state = {
      model: initializeModel,           // model to edit
      submitted: false,
      adding: match.params.id === "0",
      cPerm: ops.includes('C'), // create permission
      rPerm: ops.includes('R'), // read permission
      uPerm: ops.includes('U'), // update permission
      dPerm: ops.includes('D')  // delete permission
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleOperationsChange = this.handleOperationsChange.bind(this)
    this.handleResourceChange = this.handleResourceChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    dispatch(alertActions.clear())  // clear alert messages from other pages
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

  canBeSaved() { // check for changes in mModel, if changes present, it can save
    const { cPerm, rPerm, uPerm, dPerm, model } = this.state
    if (! (cPerm || rPerm || uPerm || dPerm) ) return false; // no operations selected, if so, cannot save changes
    if (!model.resource) return false // no resource selected, if so, cannot save changes
    if (!model.description) return false // no description entered, if so, cannot save changes
    return true // can save changes
  }
  changedProps() {
    const { model, cPerm, rPerm, uPerm, dPerm } = this.state
    const { location } = this.props
    let modelDB = location.state.model
    let props = []
    let ops = ''
    ops += cPerm?'C':''
    ops += rPerm?'R':''
    ops += uPerm?'U':''
    ops += dPerm?'D':''
    model.operations = ops

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
  handleOperationsChange(event) {
    const { value } = event.target
    const { cPerm, rPerm, uPerm, dPerm } = this.state

    // toggle state value
    switch(value) {
      case 'C': this.setState({ cPerm: !cPerm }); break
      case 'R': this.setState({ rPerm: !rPerm }); break
      case 'U': this.setState({ uPerm: !uPerm }); break
      case 'D': this.setState({ dPerm: !dPerm }); break
      default: return ''
    }
  }
  handleResourceChange(resource) {
    const { model } = this.state
    this.setState({
      model: {
        ...model,
        resource: resource
      }
    })
  }
  render() {
    const { alert } = this.props
    return (
      <div>
        <h2>Permission Details</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        {this.show()}
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
          {this.showOperations()}
          {this.showResource()}
        </div>
        <div data-row-span="1">
          {this.showCondition()}
        </div>
        <div data-row-span="1">
          {this.showDescription()}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary" hidden={!authzn.allowsEdit} title="Save changes">Save</Button>
      <Button color="link"><Link to="/permissions" className="text-danger" title="Go to Permissions">Cancel</Link></Button>
    </Form>
  }
  showOperations() {
    const { submitted, cPerm, rPerm, uPerm, dPerm } = this.state

    return <div data-field-span="1">
        <Label>Operations</Label>
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              name="operations"
              value="C"
              checked={cPerm}
              onChange={this.handleOperationsChange}
            /> Create
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              name="operations"
              value="R"
              checked={rPerm}
              onChange={this.handleOperationsChange}
            /> Read
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              name="operations"
              value="U"
              checked={uPerm}
              onChange={this.handleOperationsChange}
            /> Update
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              name="operations"
              value="D"
              checked={dPerm}
              onChange={this.handleOperationsChange}
            /> Delete
          </Label>
        </FormGroup>
        {submitted && (!cPerm && !rPerm && !uPerm && !dPerm)
          && <FormText color="danger">Operation(s) is/are required</FormText>}
      </div>
  }
  showResource() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
      <Label>Resource</Label>
      <Select
        name="form-field-name"
        value={model.resource}
        simpleValue={true}
        placeholder="Select a Resource..."
        onChange={this.handleResourceChange}
        valueKey="name"
        labelKey="label"
        options={MODULES}
      />
      {submitted &&  !model.resource
        && <FormText color="danger">Resource is required</FormText>}
     </div>
  }
  showCondition() {
    const { model } = this.state
    return <div data-field-span="1">
				<Label>Conditions (optional)</Label>
        <Input
          type="text"
          name="condition"
          value={model.condition}
          placeholder="<conditional script here>"
          title="Short condition on Permission"
          className="inputField"
          onChange={this.handleChange}
        />
			</div>
  }
  showDescription() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Description</Label>
        <Input
          type="text"
          name="description"
          value={model.description}
          placeholder="Description here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.description
          && <FormText color="danger">Description is required</FormText>}
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

const connectedDetailsPage = connect(mapStateToProps)(PermissionDetailsPage)
export { connectedDetailsPage as PermissionDetailsPage }

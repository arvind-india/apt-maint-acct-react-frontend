import React from 'react'
import { Redirect } from 'react-router-dom'
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
    Col,
    FormFeedback
} from 'reactstrap'

import { permissionActions as actions, alertActions } from '../_actions'
import { MODULES } from '../_constants'

class PermissionDetailsPage extends React.Component {

  constructor(props) {
    super(props)
console.log('props in constructor: ', props)
    const { dispatch, match, location } = props
    let model = location.state.model // model supplied from list page
    let operations = model.operations?model.operations:''
    this.state = {
      model: { ...model },           // model to edit
      submitted: false,
      adding: match.params.id === "0",
      cPerm: operations.includes('C'), // create permission
      rPerm: operations.includes('R'), // read permission
      uPerm: operations.includes('U'), // update permission
      dPerm: operations.includes('D')  // delete permission
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleOperationsChange = this.handleOperationsChange.bind(this)
    this.handleResourceChange = this.handleResourceChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    // dispatch(actions.getAll())
    dispatch(alertActions.clear())  // clear alert messages from other pages
  }
/*  componentDidMount() {
    this.props.dispatch(actions.getById(this.props.match.params.id))
    console.log('props on componentDidMount: ', this.props)
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { mModel, adding } = this.state
    const { dispatch, permissionDetails } = this.props
    let modelDB = permissionDetails.data
    let canSave = this.canSave()
    let cProps = this.changedProps()
    if(adding) {
      modelDB.id = 0
    }
    if(canSave) {
      mModel.id = modelDB.id
    }
    if ( cProps.length == 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if(canSave){
      dispatch(actions.saveChanges(mModel))
    } else {
      dispatch(alertActions.error('Missing data'))
    }

  }
  canSave() { // check for changes in mModel, if changes present, it can save
    const { mModel } = this.state
    if(mModel.resource == null){ // no changes in resource, then remove this attribute
      delete mModel.resource
    }
    for(const prop in mModel) {
      if(prop == 'resource' && mModel.resource == '')
        return true; // empty resource is valid
      if( !mModel[prop] ) {
        return false
      }
    }
    return true
  }
  changedProps() {
    const { mModel } = this.state
    const { permissionDetails } = this.props
    let modelDB = permissionDetails.data
    let props = []
    // check for changes in mModel props
    for(const prop in mModel) {
      if(modelDB[prop] != mModel[prop]) { // if data is changed wrt data in database
        props.push(prop)
      } else {
        delete mModel[prop]  // remove unchanged property
      }
    }
    return props;
  }
*/
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { model } = this.state
    const { dispatch, location } = this.props
    //let modelDB = location.state.model
    //let canSave = this.canSave()
    //let cProps = this.changedProps()
/*    if(adding) {
      this.setState({ id: 0 })
    } */
    if ( this.changedProps().length == 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if(this.canBeSaved()){
      console.log('Model to be saved: ', model)
      dispatch(actions.saveChanges(model))
    } else {
      dispatch(alertActions.error('Missing data'))
    }
  }

/*  modifiedModel() {
    const { id, operations, resource, condition, description } = this.state
    return {
      id,
      operations,
      resource,
      condition,
      description
    }
  } */
  canBeSaved() { // check for changes in mModel, if changes present, it can save
    const { cPerm, rPerm, uPerm, dPerm, model } = this.state

/*    let ops = ''
    ops += cPerm?'C':''
    ops += rPerm?'R'
    if (cPerm) ops += 'C'
    if (rPerm) ops += 'R'
    if (uPerm) ops += 'U'
    if (dPerm) ops += 'D' */
console.log('cPerm: '+cPerm+', rPerm: '+rPerm+', uPerm: '+uPerm+', dPerm: '+dPerm)
//console.log('rebuilt operations: ', ops)
//    if (!model.operations) return false // no operations selected, if so, cannot save changes
//    else model.operations = ops
    if (! (cPerm || rPerm || uPerm || dPerm) ) return false; // no operations selected, if so, cannot save changes
    if (!model.resource) return false // no resource selected, if so, cannot save changes
    if (!model.description) return false // no description entered, if so, cannot save changes

    return true // can save changes
  }
  changedProps() {
    const { model, cPerm, rPerm, uPerm, dPerm } = this.state
    const { location } = this.props
    let modelDB = location.state.model
console.log('modelDB: ', modelDB)
console.log('mModel: ', model)
    let props = []
    let ops = ''
    ops += cPerm?'C':''
    ops += rPerm?'R':''
    ops += uPerm?'U':''
    ops += dPerm?'D':''
    model.operations = ops

    // check for changes in mModel props
    for(const prop in model) {
      if( prop == 'id') continue
      if(modelDB[prop] != model[prop]) { // if data is changed wrt data in database
        props.push(prop)
      } else {
        delete model[prop]
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
    const { name, value } = event.target
    const { cPerm, rPerm, uPerm, dPerm } = this.state
console.log('operations change: ', value)
    // toggle state value
    switch(value) {
      case 'C': this.setState({ cPerm: !cPerm }); break
      case 'R': this.setState({ rPerm: !rPerm }); break
      case 'U': this.setState({ uPerm: !uPerm }); break
      case 'D': this.setState({ dPerm: !dPerm }); break
    }
  }
  handleResourceChange(resource) {
    const { model } = this.state
console.log('resource: ', resource)
    this.setState({
      model: {
        ...model,
        resource: resource
      }
    })
  }
  render() {
/*    const { permissionDetails, user, match, alert, submitted } = this.props
    let model = permissionDetails
    return (
      <div>
        <h2>Permission Details</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        {model.loading && <em>Loading model details...}</em>}
        {model.error && <span className="text-danger">{model.error}</span>}
        {model.data && this.show()}
      </div>
    ) */
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
    let title = this.state.adding?'Add':'View or Edit'
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
      <Button type="submit" color="primary">Save</Button>
      <Button color="link"><Link to="/permissions">Cancel</Link></Button>
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
          && <FormText color="danger">Operations is required</FormText>}
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
        placeholder="Select Inherits..."
        onChange={this.handleResourceChange}
        valueKey="name"
        labelKey="label"
        options={MODULES}
      />
      {submitted && model.resource != null && model.resource == ""
        && <FormText color="danger">Resource is required</FormText>}
     </div>
  }
  showCondition() {
    const { model } = this.state
    return <div data-field-span="1">
				<Label>Conditions</Label>
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
        {submitted && model.description != null && model.description == ""
          && <FormText color="danger">Description is required</FormText>}
			</div>
  }
}

function mapStateToProps(state) {
  const { authentication, alert } = state
  const { user } = authentication
  return {
    user,
    alert
  }
}

const connectedDetailsPage = connect(mapStateToProps)(PermissionDetailsPage)
export { connectedDetailsPage as PermissionDetailsPage }

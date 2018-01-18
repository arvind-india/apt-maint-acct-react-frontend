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
    const { dispatch, permissionDetails, match, location } = props
    let iModel = location.state.model // initial model
    let operations = iModel.operations?iModel.operations:''
    this.state = {
      ...iModel,
      submitted: false,
      touched: false,
      adding: match.params.id === "0",
      cPerm: operations.includes('C'), // create permission
      rPerm: operations.includes('R'), // read permission
      uPerm: operations.includes('U'), // update permission
      dPerm: operations.includes('D')  // delete permission
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleOperationsChange = this.handleOperationsChange.bind(this)
//    this.handleResourceChange = this.handleResourceChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    // dispatch(actions.getAll())
    dispatch(alertActions.clear())  // clear alert messages from other pages
  }
  componentDidMount() {
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
  handleChange(event) {
    const { name, value } = event.target
    this.setState({
        [name]: value
    })
  }
  handleOperationsChange(event) {
    const { name, value } = event.target
    const { cPerm, rPerm, uPerm, dPerm } = this.state
    // toggle state value
    switch(value) {
      case 'C': this.setState({ cPerm: !cPerm }); break
      case 'R': this.setState({ rPerm: !rPerm }); break
      case 'U': this.setState({ uPerm: !uPerm }); break
      case 'D': this.setState({ dPerm: !dPerm }); break
    }
  }
/*  handleResourceChange(resource) {
    // const { mModel } = this.state
console.log('resource: ', resource)
    this.setState({
      resource: resource
    })
  } */
  render() {
    const { permissionDetails, user, match, alert, submitted } = this.props
    let model = permissionDetails
    return (
      <div>
        <h2>Permission Details</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        {model.loading && <em>Loading model details...}</em>}
        {model.error && <span className="text-danger">{model.error}</span>}
        {model.data && this.show(model.data)}
      </div>
    )
  }
  show(data){
    let title = this.state.adding?'Add':'View or Edit'
    return <Form onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>{title}</legend>
        <div data-row-span="2">
          {this.showOperations(data)}
          {this.showResource(data)}
        </div>
        <div data-row-span="1">
          {this.showCondition(data)}
        </div>
        <div data-row-span="1">
          {this.showDescription(data)}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary">Save</Button>
      <Button color="link"><Link to="/permissions">Cancel</Link></Button>
    </Form>
  }
  showOperations(data) {
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
        {submitted && (cPerm || rPerm || uPerm || dPerm)
          && <FormText color="danger">Permission operations is required</FormText>}
      </div>
  }
  showResource(data) {
    const { submitted, resource } = this.state
    return <div data-field-span="1">
      <Label>Resource</Label>
      <Select
        name="form-field-name"
        value={resource}
        simpleValue={true}
        placeholder="Select Inherits..."
        onChange={this.handleChange}
        valueKey="name"
        labelKey="label"
        options={MODULES}
      />
      {submitted && resource != null && resource == ""
        && <FormText color="danger">Permission resource is required</FormText>}
     </div>
  }
  showCondition(data) {
    const { condition } = this.state
    return <div data-field-span="1">
				<Label>Conditions</Label>
        <Input
          type="text"
          name="condition"
          value={condition}
          placeholder="<conditional script here>"
          title="Short condition on Permission"
          className="inputField"
          onChange={this.handleChange}
        />
			</div>
  }
  showDescription(data) {
    const { submitted, description } = this.state
    return <div data-field-span="1">
				<Label>Description</Label>
        <Input
          type="text"
          name="description"
          value={description}
          placeholder="Description here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && description != null && description == ""
          && <FormText color="danger">Permission description is required</FormText>}
			</div>
  }
}

function mapStateToProps(state) {
  const { permissionDetails, authentication, alert } = state
  const { user } = authentication
  return {
    user,
    permissionDetails,
    alert
  }
}

const connectedDetailsPage = connect(mapStateToProps)(PermissionDetailsPage)
export { connectedDetailsPage as PermissionDetailsPage }

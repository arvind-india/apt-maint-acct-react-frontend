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


class PermissionDetailsPage extends React.Component {

  constructor(props) {
    super(props)
    const { dispatch, permissionDetails, match } = props
    this.state = {
      mModel: {   // model being modified
        inherits: null
      },
      selectedOption: null,
      submitted: false,
      touched: false,
      adding: match.params.id==="0"
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleInheritsChange = this.handleInheritsChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    dispatch(actions.getAll())
    dispatch(alertActions.clear())  // clear alert messages from other pages
  }
  componentDidMount() {
    this.props.dispatch(actions.getById(this.props.match.params.id))
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
    if(mModel.inherits == null){ // no changes in inherits, then remove this attribute
      delete mModel.inherits
    }
    for(const prop in mModel) {
      if(prop == 'inherits' && mModel.inherits == '')
        return true; // empty inherits is valid
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
    const { mModel } = this.state
    this.setState({
      mModel: {
        ...mModel,
        [name]: value
      }
    })
  }
  handleOperationsChange(event) {
    const { name, value } = event.target
    const { mModel } = this.state
console.log('name: ', name)    
console.log('value: ', value)
    this.setState({
      mModel: {
        ...mModel,
        operations: value
      }
    })
  }
  handleResourceChange(selectedOption) {
    const { mModel } = this.state
console.log('selectedOption: ', selectedOption)
    this.setState({
      mModel: {
        ...mModel,
        operations: selectedOption
      }
    })
  }
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
    const { submitted, mModel } = this.state
console.log('Data is: ', data)
console.log('mModel: ', mModel)
    let ops = mModel.operations ? mModel.operations : data.operations
    return <div data-field-span="1">
        <Label>Operations</Label>
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              name="operations"
              value="C"
              checked={ops.includes('C')}
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
              checked={ops.includes('R')}
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
              checked={ops.includes('U')}
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
              checked={ops.includes('D')}
              onChange={this.handleOperationsChange}
            /> Delete
          </Label>
        </FormGroup>
      </div>
  }
  showResource(data) {
    const { mModel } = this.state
    const { permissions } = this.props
    let options = []
    if(permissions.items) {
      options = permissions.items.filter(each => each.name != data.name)
    }
    return <div data-field-span="1">
      <Label>Resource</Label>
      <Select
        name="form-field-name"
        value={mModel.inherits!==null?mModel.inherits:data.inherits}
        multi={false}
        joinValues={false}
        simpleValue={true}
        placeholder="Select Inherits..."
        onChange={this.handleResourceChange}
        defaultValue="guest"
        valueKey="name"
        labelKey="name"
        options={options}
      />
     </div>
  }
  showCondition(data) {
    const { submitted, mModel } = this.state
    return <div data-field-span="1">
				<Label>Description</Label>
        <Input
          type="text"
          name="description"
          placeholder="Description here"
          className="inputField"
          defaultValue={data.description}
          onChange={this.handleChange}
        />
        {submitted && mModel.description != null && mModel.description == ""
          && <FormText color="danger">Permission description is required</FormText>}
			</div>
  }
  showDescription(data) {
    const { submitted, mModel } = this.state
    return <div data-field-span="1">
				<Label>Description</Label>
        <Input
          type="text"
          name="description"
          placeholder="Description here"
          className="inputField"
          defaultValue={data.description}
          onChange={this.handleChange}
        />
        {submitted && mModel.description != null && mModel.description == ""
          && <FormText color="danger">Permission description is required</FormText>}
			</div>
  }
}

function mapStateToProps(state) {
  const { permissions, permissionDetails, authentication, alert } = state
  const { user } = authentication
  return {
    user,
    permissions,
    permissionDetails,
    alert
  }
}

const connectedDetailsPage = connect(mapStateToProps)(PermissionDetailsPage)
export { connectedDetailsPage as PermissionDetailsPage }

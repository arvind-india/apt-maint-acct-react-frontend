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
//    Col,
//    FormFeedback
} from 'reactstrap'

import { roleActions as actions, alertActions } from '../_actions'

let module = 'roles' // module name

class RoleDetailsPage extends React.Component {

  constructor(props) {
    super(props)
    const { dispatch, match, location } = props
    let model = location.state.model // model supplied from list page
    let initializeModel = {
      id: model.id,
      name: model.name,
      inherits: model.inherits,
      description: model.description
    }
    this.state = {
      model: initializeModel,           // model to edit
      submitted: false,
      adding: match.params.id==="0"
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleInheritsChange = this.handleInheritsChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    dispatch(alertActions.clear())  // clear alert messages from other pages
  }

  render() {
    const { alert } = this.props
    return (
      <div>
        <h2>Role Details</h2>
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
          {this.showRolename()}
          {this.showInherits()}
        </div>
        <div data-row-span="1">
          {this.showDescription()}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary" hidden={!authzn.allowsEdit} title="Save changes">Save</Button>
      <Button color="link"><Link to="/roles" className="text-danger" title="Go to Roles">Cancel</Link></Button>
    </Form>
  }
  showRolename() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Role Name</Label>
        <Input
          type="text"
          name="name"
          value={model.name}
          placeholder="Role name here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.name &&
          <FormText color="danger">Name is required</FormText>}
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

  showInherits() {
    const { model } = this.state
    const { roles } = this.props
    let options = []
    if(roles.items) {
      options = roles.items.filter(each => each.name !== model.name)
    }
    return <div data-field-span="1">
      <Label>Inherits (optional)</Label>
      <Select
        name="form-field-name"
        value={model.inherits}
        multi={true}
        joinValues={true}
        simpleValue={true}
        placeholder="Select Inherits..."
        onChange={this.handleInheritsChange}
        valueKey="name"
        labelKey="name"
        options={options}
      />
     </div>
  }
  handleInheritsChange(selectedOption) {
    const { model } = this.state
    this.setState({
      model: {
        ...model,
        inherits: selectedOption
      }
    })
  }
  showDescription(data) {
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
        {submitted && !model.description &&
          <FormText color="danger">Description is required</FormText>}
			</div>
  }

  handleSubmit(event) {
    const { model } = this.state
    const { dispatch } = this.props

    event.preventDefault()
    this.setState({ submitted: true })

    if ( this.changedProps().length === 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if( this.canBeSaved() ) {
      dispatch(actions.saveChanges(model))
    } else {
      dispatch(alertActions.error('Missing data'))
    }
  }
  canBeSaved() { // check for changes in model, if changes present, it can save
    const { model } = this.state
    for(const prop in model) {
      if( prop === 'id') continue // skip 'id' from checking null or empty value
      if( !model[prop] ) {
        return false
      }
    }
    return true
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
}

function mapStateToProps(state) {
  const { roles, alert, authorizations } = state
//  const { user } = authentication
  const authzn = authorizations[module]
  return {
//    user,
    roles,
    alert,
    authzn
  }
}

const connectedDetailsPage = connect(mapStateToProps)(RoleDetailsPage)
export { connectedDetailsPage as RoleDetailsPage }

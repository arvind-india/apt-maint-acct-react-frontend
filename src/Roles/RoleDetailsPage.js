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

import { roleActions as actions, alertActions } from '../_actions'


class RoleDetailsPage extends React.Component {

  constructor(props) {
    super(props)
    const { dispatch, roleDetails } = props
    console.log('RoleDetails in constructor: ', roleDetails)
    this.state = {
      mModel: {   // model being modified
        inherits: null
      },
      selectedOption: null,
      submitted: false,
      touched: false
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
    const { mModel } = this.state
    event.preventDefault()
    this.setState({ submitted: true })

    const { dispatch, roleDetails } = this.props
    let modelDB = roleDetails.data
    let canSave = mModel.name && mModel.description?true:false
    dispatch(actions.saveChanges(mModel))
  }
  handleChange(event) {
    const { name, value } = event.target
    const { mModel } = this.state
    this.setState({
      [name]: value
    })
  }

  render() {
    const { roleDetails, user, match, alert, submitted } = this.props
    console.log('Role Details render props: ', this.props)
    let model = roleDetails
    return (
      <div>
        <h2>Role Details</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        {model.loading && <em>Loading user details...}</em>}
        {model.error && <span className="text-danger">{model.error}</span>}
        {model.data && this.show(model.data)}
      </div>
    )
  }
  show(data){
    return <Form onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>View or Edit</legend>
        <div data-row-span="2">
          {this.showRolename(data)}
          {this.showInherits(data)}
        </div>
        <div data-row-span="1">
          {this.showDescription(data)}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary">Save</Button>
      <Button color="link"><Link to="/roles">Cancel</Link></Button>
    </Form>
  }
  showRolename(data) {
    const { submitted, mModel } = this.state
    return <div data-field-span="1">
				<Label>Role Name</Label>
        <Input
          type="text"
          name="name"
          placeholder="Role name here"
          className="inputField"
          defaultValue={data.name}
          onChange={this.handleChange}
        />
        {submitted && mModel.name != null && mModel.name == ""
          && <FormText color="danger">Role-Name is required</FormText>}
			</div>
  }
  handleInheritsChange(selectedOption) {
    this.setState({
      mModel: {
        inherits: selectedOption
      }
    })
  }
  showInherits(data) {
    const { mModel } = this.state
    const { roles } = this.props
    return <div data-field-span="1">
      <Label>Inherits</Label>
      <Select
        name="form-field-name"
        value={mModel.inherits!==null?mModel.inherits:data.inherits}
        multi={true}
        joinValues={true}
        simpleValue={true}
        placeholder="Select Inherits..."
        onChange={this.handleInheritsChange}
        defaultValue="guest"
        valueKey="name"
        labelKey="name"
        options={roles.items.filter(each => each.name != data.name)}
      />
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
        && <FormText color="danger">Role-Description is required</FormText>}
			</div>
  }
}

function mapStateToProps(state) {
  const { roles, roleDetails, authentication, alert } = state
  const { user } = authentication
  return {
    user,
    roles,
    roleDetails,
    alert
  }
}

const connectedDetailsPage = connect(mapStateToProps)(RoleDetailsPage)
export { connectedDetailsPage as RoleDetailsPage }

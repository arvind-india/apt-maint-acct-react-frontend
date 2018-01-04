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
console.log('Role Details Page constructor: ', props)
    const { dispatch, roleDetails } = props

    this.state = {
      mModel: {}, // model being modified
      selectedOption: '',
      submitted: false,
      touched: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    dispatch(alertActions.clear())  // clear alert messages from other pages
  }
  componentDidMount() {
    this.props.dispatch(actions.getById(this.props.match.params.id))
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

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
          {this.showMultiSelect(data)}
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

  showInherits(data) {
    const { submitted, mModel } = this.state
    return <div data-field-span="1">
				<Label>Role Name</Label>
        <Input
          type="text"
          name="inherits"
          placeholder="Inherits here"
          className="inputField"
          defaultValue={data.inherits}
          onChange={this.handleChange}
        />
        {submitted && mModel.inherits != null && mModel.inherits == ""
        && <FormText color="danger">Role-Inherits is required</FormText>}
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

  showMultiSelect(data) {
    const { selectedOption } = this.state;
  	const value = selectedOption && selectedOption.value;

    return (
      <Select
        name="form-field-name"
        value={value}
        onChange={this.handleChange}
        options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
      />
    );    
  }
}

function mapStateToProps(state) {
  const { roleDetails, authentication, alert } = state
  const { user } = authentication
  return {
    user,
    roleDetails,
    alert
  }
}

const connectedDetailsPage = connect(mapStateToProps)(RoleDetailsPage)
export { connectedDetailsPage as RoleDetailsPage }

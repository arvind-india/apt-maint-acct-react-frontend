import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import {
          Form,
          Button,
          FormGroup,
          FormFeedback,
          Input,
          Label,
          Col
} from 'reactstrap'

import { userActions } from '../_actions'

class UserDetailsPage extends React.Component {

  componentDidMount() {
    this.props.dispatch(userActions.getById(this.props.match.params.id))
  }

  handleChange(event) {
    const { name, value } = event.target
    const { user } = this.state
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    })
  }

  render() {
    const { userDetails, user, match } = this.props
    return (
      <div>
        <h3>User Details of {match.params.id}</h3>
        {userDetails.loading && <em>Loading user details...}</em>}
        {userDetails.error && <span className="text-danger">ERROR: {userDetails.error}</span>}
        {userDetails.data &&
          <p>User email: {userDetails.data.email}</p>
        }
        {userDetails.data && this.show(userDetails.data)}
      </div>
    )
  }

  show(user){
    return <Form onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>View / Edit</legend>
        {this.showUsername(user)}
        {this.showFirstAndLastName(user)}
      </fieldset>
    </Form>
  }

  showUsername(user) {
    return <div data-row-span="1">
			<div data-field-span="1">
				<label for="userName">Username</label>
        <Input
          type="text"
          name="name"
          placeholder="User name here"
          defaultValue={user.name}
          onChange={this.handleChange}
        />
        { !user.name && <FormFeedback>User Name is required</FormFeedback>}
			</div>
	  </div>
  }
  showFirstAndLastName(user) {
    return <div data-row-span="2">
      <div data-field-span="1">
        <label for="firstName">FirstName</label>
        <Input
          type="text"
          name="first_name"
          placeholder="First name here"
          defaultValue={user.first_name}
          onChange={this.handleChange}
        />
        {!user.first_name && <FormFeedback>First Name is required</FormFeedback>}
      </div>
      <div data-field-span="1">
        <label for="lastName">LastName</label>
        <Input
          type="text"
          name="last_name"
          placeholder="Last name here"
          defaultValue={user.last_name}
          onChange={this.handleChange}
        />
        {!user.last_name && <FormFeedback>Last Name is required</FormFeedback>}
      </div>
    </div>
  }

}

/*

return (
  <div>
    <h3>Users List</h3>
    {users.loading && <em>Loading users...}</em>}
    {users.error && <span className="text-danger">ERROR: {users.error}</span>}
    {users.items &&
      <Table>


*/


function mapStateToProps(state) {
  const { userDetails, authentication } = state
  const { user } = authentication
  return {
    user,
    userDetails
  }
}

const connectedDetailsPage = connect(mapStateToProps)(UserDetailsPage)
export { connectedDetailsPage as UserDetailsPage }

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
  constructor(props) {
    super(props)
    this.state = {
      user: {
        name: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        infos: []
      },
      confirmPassword: '',
      submitted: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.props.dispatch(userActions.getById(this.props.match.params.id))
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { user, confirmPassword } = this.state
    const { dispatch } = this.props
    if(user.name &&
        user.first_name &&
        user.last_name &&
        user.email &&
        user.password &&
        confirmPassword &&
        user.password === confirmPassword
      ) {
          dispatch(userActions.saveChanges(user))
        }
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
        <h2>User Details</h2>
        {userDetails.loading && <em>Loading user details...}</em>}
        {userDetails.error && <span className="text-danger">ERROR: {userDetails.error}</span>}
        {userDetails.data && this.show(userDetails.data)}
      </div>
    )
  }

  show(user){
    return <Form onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>View or Edit</legend>
        <div data-row-span="1">
          {this.showUsername(user)}
        </div>
        <div data-row-span="2">
          {this.showFirstName(user)}
          {this.showLastName(user)}
        </div>
        <div data-row-span="2">
          {this.showEmail(user)}
          {this.showPassword(user)}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary">Save</Button>
      <Button color="link"><Link to="/users">Cancel</Link></Button>
    </Form>
  }

  showUsername(user) {
    return <div data-field-span="1">
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
  }
  showFirstName(user) {
    return <div data-field-span="1">
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
  }
  showLastName(user) {
    return <div data-field-span="1">
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
  }
  showEmail(user){
    return <div data-field-span="1">
        <label for="eMail">email</label>
        <input
          type="email"
          name="eMail"
          placeholder="<email id here>"
          title="eMail ID of the User"
          defaultValue={user.email}
          onChange={this.handleChange}
        />
        {!user.email && <FormFeedback>Email-id is required</FormFeedback>}
      </div>
  }
  showPassword(user){
    return <div data-field-span="1">
      <label for="passWord">Password</label>
      <input
        type="password"
        id="passWord"
        required
        name="passWord"
        placeholder="<enter password here>"
        title="Password is required"
        defaultValue={user.password}
        onChange={this.handleChange}
      />
      {!user.password && <FormFeedback>Password is required</FormFeedback>}
    </div>
  }

}

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

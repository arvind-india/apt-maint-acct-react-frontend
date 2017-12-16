import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import {
          Form,
          Button,
          FormGroup,
          FormText,
          Input,
          Label,
          Col
} from 'reactstrap'

import { userActions, alertActions } from '../_actions'

class UserDetailsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        user: {},
/*      user: {
        name: null,
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        infos: []
      },  */
      password: '',
      confirmPassword: '',
      submitted: false,
      passwordChanged: false,
      passwordMatches: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handlePasswordChange= this.handlePasswordChange.bind(this)
    this.handleConfirmPasswordChange= this.handleConfirmPasswordChange.bind(this)
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

    console.log('User to be updated: ', user)

    if(user.name &&
        user.first_name &&
        user.last_name &&
        user.email
      ) {
          dispatch(userActions.saveChanges(user))
        } else {
          dispatch(alertActions.error('Missing data...'))
        }
  }
  handlePasswordChange(event) {
    const { name, value } = event.target
    this.setState({ [name]: value  })
    if(value) {
      // console.log('Password is changed!')
      this.setState({ passwordChanged: true })
    } else {
      // console.log('Password is NOT changed')
      this.setState({ passwordChanged: false})
    }
  }
  handleConfirmPasswordChange(event) {
    const { name, value } = event.target
    // console.log('Name: ', name)
    // console.log('Value: ', value)
    this.setState({ [name]: value })

    if(value && value === this.state.password) {
      // console.log('Password matches!')
      this.setState({ passwordMatches: true })
    } else {
      // console.log('Password do not match')
      this.setState({ passwordMatches: false })
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
    const { userDetails, user, match, alert } = this.props
    return (
      <div>
        <h2>User Details</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        {userDetails.loading && <em>Loading user details...}</em>}
        {userDetails.error && <span className="text-danger">ERROR: {userDetails.error}</span>}
        {userDetails.data && this.show(userDetails.data)}
      </div>
    )
  }

  show(user){
    this.originalPassword = user.password  // keep original password for comparison purpose
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
          {this.showPassword()}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary">Save</Button>
      <Button color="link"><Link to="/users">Cancel</Link></Button>
    </Form>
  }

  showUsername(user) {
    return <div data-field-span="1">
				<Label>Username</Label>
        <Input
          type="text"
          name="name"
          placeholder="User name here"
          defaultValue={user.name}
          onChange={this.handleChange}
        />
        {!this.user.name && <FormText color="danger">User Name is required</FormText>}
			</div>
  }
  showFirstName(user) {
    return <div data-field-span="1">
        <Label>FirstName</Label>
        <Input
          type="text"
          name="first_name"
          placeholder="First name here"
          defaultValue={user.first_name}
          onChange={this.handleChange}
        />
        {this.submitted && !user.first_name && <FormText color="danger">First Name is required</FormText>}
      </div>
  }
  showLastName(user) {
    return <div data-field-span="1">
        <Label>LastName</Label>
        <Input
          type="text"
          name="last_name"
          placeholder="Last name here"
          defaultValue={user.last_name}
          onChange={this.handleChange}
        />
        {this.submitted && !user.last_name && <FormText color="danger">Last Name is required</FormText>}
      </div>
  }
  showEmail(user){
    return <div data-field-span="1">
        <Label>email</Label>
        <Input
          type="email"
          name="eMail"
          placeholder="<email id here>"
          title="eMail ID of the User"
          defaultValue={user.email}
          onChange={this.handleChange}
        />
        {this.submitted && !user.email && <FormText color="danger">Email-id is required</FormText>}
      </div>
  }
  showPassword(){
    return <div data-field-span="1">
      <Label>Password</Label>
      <Input
        type="password"
        name="password"
        placeholder="<enter password here>"
        title="Password is required"
        defaultValue={this.state.password}
        onChange={this.handlePasswordChange}
      />
      {this.state.passwordChanged &&
        <div data-field-span="1">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmpassword"
            placeholder="<repeat password here>"
            title="Confirm Password is required"
            defaultValue={this.state.confirmPassword}
            onChange={this.handleConfirmPasswordChange}
          />
          <FormText color="danger">Password do NOT match</FormText>
        </div>
      }
    </div>
  }
}

function mapStateToProps(state) {
  const { userDetails, authentication, alert } = state
  const { user } = authentication
  return {
    user,
    userDetails,
    alert
  }
}

const connectedDetailsPage = connect(mapStateToProps)(UserDetailsPage)
export { connectedDetailsPage as UserDetailsPage }

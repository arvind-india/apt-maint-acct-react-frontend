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
      password: '',
      confirmPassword: '',
      submitted: false,
      passwordChanged: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handlePasswordChange= this.handlePasswordChange.bind(this)
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
        user.email
      ) {
          dispatch(userActions.saveChanges(user))
        }
  }
  handlePasswordChange(event) {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
    console.log('Password now: ', this.password)
    if(this.password !== '') {
      console.log('Password is changed!')
      this.setState({ passwordChanged: true })
    } else {
      console.log('Password is NOT changed')
      this.setState({ passwordChanged: false})
    }
  }
  handleChange(event) {
    const { name, value } = event.target
    const { user } = this.state
    console.log('CHANGED: ', name); console.log('NEW VALUE: ', value);
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
        { !user.name && <FormFeedback>User Name is required</FormFeedback>}
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
        {!user.first_name && <FormFeedback>First Name is required</FormFeedback>}
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
        {!user.last_name && <FormFeedback>Last Name is required</FormFeedback>}
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
        {!user.email && <FormFeedback>Email-id is required</FormFeedback>}
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
        defaultValue={this.password}
        onChange={this.handlePasswordChange}
      />
      {!this.password && <FormFeedback>Password is required</FormFeedback>}
      {this.passwordChanged &&
        <div data-field-span="1">
          <Label>Confirm Password</Label>
          <Input
          type="password"
          name="confirmpassword"
          placeholder="<repeat password here>"
          title="Confirm Password is required"
          defaultValue={this.confirmPassword}
          onChange={this.handlePasswordChange}
          />
        </div>
      }
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

import React from 'react'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
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
    const { dispatch } = props
    this.state = {
      mUser: {},
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

    dispatch(alertActions.clear())  // clear alert messages from other pages
  }
  componentDidMount() {
    this.props.dispatch(userActions.getById(this.props.match.params.id))
  }
  hasChanges(mUser) {
    for(const prop in mUser){
      return true
    }
    return false
  }
  changedProps(mUser) {
    let props = []
    for(const prop in mUser) {
      props.push(prop)
    }
    return props
  }
  canSave(mUser) {
    let result = false
    for(const prop in mUser) {
        if(mUser[prop]) { // check every property for null or empty string
          result = true
        } else {
          result = false
        }
    }
    return result
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { mUser, submitted, confirmPassword } = this.state
    const { dispatch, userDetails } = this.props

    console.log('Current state: ', this.state)
    console.log('submitted 1: ', this.state.submitted)

    let canSave = this.canSave(mUser)
    let cProps = this.changedProps(mUser)
    let hasChanges = cProps.length > 0
    let hasEmailChange = cProps.includes('email')
/*
    for(const prop in mUser) {
        hasChanges = true
        if(mUser[prop]) {
          canSave = true
          console.log(prop + ' is modified to: ' + mUser[prop])
        }
        mUser.id = userDetails.data.id
    }  */

    if(canSave) {
      mUser.id = userDetails.data.id
    }
    if(!hasEmailChange) {
      mUser.email = userDetails.data.email
    }
    console.log('User to be updated: ', mUser)
    if (!hasChanges) {
      dispatch(alertActions.error('No changes found...'))
    } else if (canSave) {
      dispatch(userActions.saveChanges(mUser))
    } else {
      dispatch(alertActions.error('Missing Data...'))
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
    const { mUser } = this.state

    this.setState({
      mUser: {
        ...mUser,
        [name]: value
      }
    })
  }

  render() {
    const { userDetails, user, match, alert, submitted } = this.props
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

  show(data){
    return <Form onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>View or Edit</legend>
        <div data-row-span="1">
          {this.showUsername(data)}
        </div>
        <div data-row-span="2">
          {this.showFirstName(data)}
          {this.showLastName(data)}
        </div>
        <div data-row-span="2">
          {this.showEmail(data)}
          {this.showPassword()}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary">Save</Button>
      <Button color="link"><Link to="/users">Cancel</Link></Button>
    </Form>
  }

  showUsername(data) {
    const {submitted, mUser} = this.state
    const { userDetails } = this.props
    const { oUser } = userDetails.data

    return <div data-field-span="1">
				<Label>Username</Label>
        <Input
          type="text"
          name="name"
          placeholder="User name here"
          defaultValue={data.name}
          onChange={this.handleChange}
        />
        {submitted && mUser.name != null && mUser.name == ""
        && <FormText color="danger">User Name is required</FormText>}
			</div>
  }
  showFirstName(data) {
    return <div data-field-span="1">
        <Label>FirstName</Label>
        <Input
          type="text"
          name="first_name"
          placeholder="First name here"
          defaultValue={data.first_name}
          onChange={this.handleChange}
        />
        {this.submitted && <FormText color="danger">First Name is required</FormText>}
      </div>
  }
  showLastName(data) {
    return <div data-field-span="1">
        <Label>LastName</Label>
        <Input
          type="text"
          name="last_name"
          placeholder="Last name here"
          defaultValue={data.last_name}
          onChange={this.handleChange}
        />
        {this.submitted && <FormText color="danger">Last Name is required</FormText>}
      </div>
  }
  showEmail(data){
    return <div data-field-span="1">
        <Label>email</Label>
        <Input
          type="email"
          name="eMail"
          placeholder="<email id here>"
          title="eMail ID of the User"
          defaultValue={data.email}
          onChange={this.handleChange}
        />
        {this.submitted && <FormText color="danger">Email-id is required</FormText>}
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

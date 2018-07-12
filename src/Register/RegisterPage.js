import React from 'react'
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
import { SocialLoginPage } from '../Login'
import { FlashMessage } from '../_components'

export class Register extends React.Component {
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
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
  handleConfirmPasswordChange(event) {
    this.setState({
      confirmPassword: event.target.value
    })
  }
  handleSubmit(event) {
    const { user } = this.state
    event.preventDefault()
    this.setState({ submitted: true })
    this.props.register(user)
  }
  render() {
    const { alert } = this.props
    return (
      <div>
        <h2 align="center">Register</h2>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        { this.validateForm() }
        <Form id="registerForm" onSubmit={this.handleSubmit}>
          { this.userName() }
          { this.email() }
          { this.firstAndLastName() }
          { this.password() }
          { this.buttons() }
        </Form>
      </div>
    )
  }

  validateForm() {
    const { user, confirmPassword } = this.state

    if(user.name &&
        user.first_name &&
        user.last_name &&
        user.email &&
        user.password &&
        confirmPassword &&
        user.password === confirmPassword
      ) {
        this.validationMsg = 'Save Changes'
        this.formValid = true
        return null
      }
    // if reached here
    this.validationMsg = 'Missing "Required Data"...'
    this.formValid = false
  }

  userName() {
    const { submitted, user } = this.state
    return <FormGroup row>
      <Col sm={{size: 4, offset: 4}}>
        { user.name && <Label for="userName" size="sm" className="formLabel">User name</Label>}
        <Input
          size="sm"
          id="userName"
          type="text"
          name="name"
          title="User name here"
          placeholder="User name"
          onChange={this.handleChange}
        />
        {submitted && !user.name && <FormText color="danger">UserName is required</FormText>}
      </Col>
    </FormGroup>
  }
  firstAndLastName() {
    const { submitted, user } = this.state
    return <FormGroup row>
      <Col sm={{size: 2, offset: 4}}>
        { (user.first_name || user.last_name) && <Label for="firstName" size="sm" className="formLabel">First name</Label>}
        <Input
          size="sm"
          id="firstName"
          type="text"
          name="first_name"
          title="First name here"
          placeholder={ (user.first_name || user.last_name) ? "": "First name"}
          onChange={this.handleChange}
        />
        {submitted && !user.first_name && <FormText color="danger">First Name is required</FormText>}
      </Col>
      <Col sm={{size: 2}}>
        {(user.last_name || user.first_name) && <Label for="lastName" size="sm" className="formLabel">Last name</Label>}
        <Input
          size="sm"
          id="lastName"
          type="text"
          name="last_name"
          title="Last name here"
          placeholder={ (user.first_name || user.last_name) ? "": "Last name" }
          onChange={this.handleChange}
        />
        {submitted && !user.last_name && <FormText color="danger">Last Name is required</FormText>}
      </Col>
    </FormGroup>
  }

  email() {
    const { submitted, user } = this.state
    return <FormGroup row>
      <Col sm={{size: 4, offset: 4}}>
        {user.email && <Label for="email" size="sm" className="formLabel">Email id</Label>}
        <Input
          size="sm"
          id="email"
          type="email"
          name="email"
          title="email id here"
          placeholder="Email id"
          onChange={this.handleChange}
        />
        {submitted && !user.email && <FormText color="danger">Email-id is required</FormText>}
      </Col>
    </FormGroup>
  }
  password() {
    const { submitted, user, confirmPassword } = this.state
    return <FormGroup row>
      <Col sm={{size: 2, offset: 4}}>
        {(user.password || confirmPassword) && <Label for="password" size="sm" className="formLabel">Password</Label>}
        <Input
          size="sm"
          id="password"
          type="password"
          name="password"
          title="password here"
          placeholder={(user.password || confirmPassword) ? "" : "Password"}
          onChange={this.handleChange}
        />
        {submitted && !user.password && <FormText color="danger">Password is required</FormText>}
      </Col>
      <Col sm={{size: 2}}>
        {(confirmPassword || user.password) && <Label for="confirmPassword" size="sm" className="formLabel">Repeat password</Label>}
        <Input
          size="sm"
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          title="Repeat password here"
          placeholder={(user.password || confirmPassword) ? "" : "Repeat password"}
          onChange={this.handleConfirmPasswordChange}
        />
        {submitted && !confirmPassword && <FormText color="danger">Repeat Password is required</FormText>}
        {user.password && confirmPassword && user.password !== confirmPassword && <FormText color="danger">Password do NOT matchG</FormText>}
      </Col>
    </FormGroup>
  }

  buttons() {
    return <FormGroup row>
      <Col sm={{size: 4, offset: 4}}>
        <Button
          type="submit"
          color="primary"
          disabled={!this.formValid}
          title={this.validationMsg}
          >Register</Button>
        <Button color="link">
          <Link
            to="/login"
            className="text-danger"
            title="Go to home"
            >Cancel</Link>
        </Button>
        <SocialLoginPage />
      </Col>

    </FormGroup>
  }

}

function mapStateToProps(state) {
  const { alert } = state
  const { registering } = state.registration
  return {
    alert,
    registering
  }
}

function mapDispatchToProps(dispatch) {
  return {
    error: (msg) => {
      dispatch(alertActions.error(msg))
    },
    register: (user) => {
      dispatch(userActions.register(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)

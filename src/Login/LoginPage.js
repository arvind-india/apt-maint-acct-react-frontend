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

import { userActions } from '../_actions'
import SocialLoginPage  from './SocialLoginPage'
import { FlashMessage } from '../_components'

export class Login extends React.Component { // exports unconnected component; used in unit testing
  constructor(props) {
    super(props)
    // reset login status
    this.props.logout()
    this.state = {
      email: '',
      password: '',
      submitted: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  handleSubmit(e) {
    const { email, password } = this.state
    const { alert } = this.props
    alert.message = '' // reset any existing alert message
    e.preventDefault()
    this.setState({ submitted: true })
    this.props.login(email, password)
  }

  render() {
    const { alert } = this.props
    return (
      <div>
        <h2 align="center">Login</h2>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={4100}/>}
        { this.validateForm() }
        <Form id="loginForm" onSubmit={this.handleSubmit}>
          { this.emailId() }
          { this.password() }
          { this.buttons1() }
          { this.buttons2() }
        </Form>
      </div>
    )
  }

  validateForm() {
    const { email, password } = this.state

    if(email && password) {
        this.validationMsg = 'Submit Credentials'
        this.formValid = true
        return null
      }
    // if reached here
    this.validationMsg = 'Missing "Required Data"...'
    this.formValid = false
  }

  emailId() {
    const { email, submitted } = this.state
    return <FormGroup>
      <Col sm={{size: 4, offset: 4}}>
        { email && <Label for="email" size="sm" className="formLabel">email id</Label> }
        <Input
          size="sm"
          id="email"
          type="email"
          name="email"
          title="email id here"
          placeholder="email id"
          defaultValue={email}
          onChange={this.handleChange.bind(this)}
        />
        {submitted && !email && <FormText color="danger">Email-id is required</FormText>}
      </Col>
    </FormGroup>
  }

  password() {
    const { password, submitted } = this.state
    return <FormGroup>
      <Col sm={{size: 4, offset: 4}}>
        { password && <Label for="password" size="sm" className="formLabel">Password</Label>}
        <Input
          size="sm"
          id="password"
          type="password"
          name="password"
          title="password here"
          placeholder="password"
          defaultValue={password}
          onChange={this.handleChange.bind(this)}
        />
        {submitted && !password && <FormText color="danger">Password is required</FormText>}
      </Col>
    </FormGroup>
  }

  buttons1() {
    return <FormGroup>
      <Col sm={{size: 4, offset: 4}}>
        <Button
          id="submitButton"
          type="submit"
          color="primary"
          bssize="large"
          disabled={!this.formValid}
          title={this.validationMsg}
          >Submit</Button>
        <Button color="link" title="Go to home">
          <Link
            to="/home"
            className="text-danger"
            >Cancel</Link>
        </Button>
        <SocialLoginPage />
      </Col>
    </FormGroup>
  }

  buttons2() {
    return <FormGroup>
      <Col sm={{size: 4, offset: 4}}>
        <Button
          id="newUser"
          color="link"
          title="Go to Registration"
          className="float-right new-user-button"
          ><Link to="/register" className="text-success new-user-link">New User?</Link>
        </Button>
        <Button
          id="forgotPassword"
          color="link"
          title="Forgot Password"
          className="float-left forgot-password-button"
          ><Link
            to="/login/forgot-password"
            className="text-info"
            title="Request for resetting forgotton password"
            >Forgot Password?</Link>
        </Button>
      </Col>
    </FormGroup>
  }

}

function mapStateToProps(state) {
  const { alert } = state
  const { loggingIn } = state.authentication
  return {
    alert,
    loggingIn
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: (email, password) => {
      dispatch(userActions.login(email, password))
    },
    logout: () => {
      dispatch(userActions.logout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

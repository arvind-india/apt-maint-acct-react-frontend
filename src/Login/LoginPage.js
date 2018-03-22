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
import SocialLoginPage  from './SocialLoginPage'

export class Login extends React.Component { // exports unconnected component; used in unit testing
  constructor(props) {
    super(props)

    // reset login status
//    this.props.dispatch(userActions.logout())
//    this.props.dispatch(alertActions.clear())  // clear alert messages from other pages
// console.log(this.props)
    this.props.logout()
    this.props.clearAlert()

    this.state = {
      email: 'guest@eastgate.in',
      password: 'password123',
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
    e.preventDefault()
    this.setState({ submitted: true })
    const { email, password } = this.state
//    const { dispatch } = this.props
    if(email && password) {
//      console.log('LoginPage: ', 'login submitted........')
//      dispatch(userActions.login(email, password))
      this.props.login(email, password)
    }
  }
  render() {
    //const { email, password, submitted } = this.state
    const { alert } = this.props
    return (
      <div>
        <h2 align="center">Login</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <Form id="loginForm" onSubmit={this.handleSubmit}>
          { this.emailId() }
          { this.password() }
          { this.buttons1() }
          { this.buttons2() }
        </Form>
      </div>
    )
  }

  emailId() {
    const { email, submitted } = this.state
    return <FormGroup row>
      <Label for="email" sm={{size: 1, offset: 4}}>Email_Id</Label>
      <Col sm={3}>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="email id here"
          defaultValue={email}
          onChange={this.handleChange.bind(this)}
        />
        {submitted && !email && <FormText color="danger">Email-id is required</FormText>}
      </Col>
    </FormGroup>
  }

  password() {
    const { password, submitted } = this.state
    return <FormGroup row>
      <Label sm={{size: 1, offset: 4}}>Password</Label>
      <Col sm={3}>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="password here"
          defaultValue={password}
          onChange={this.handleChange.bind(this)}
        />
        {submitted && !password && <FormText color="danger">Password is required</FormText>}
      </Col>
    </FormGroup>
  }

  buttons1() {
    //<Label sm={{size: 3, offset: 6}}></Label>
    return <FormGroup row>
      <Col sm={{size: 3, offset: 5}}>
        <Button
          id="submitButton"
          type="submit"
          color="primary"
          bssize="large"
          title="Go to App"
          >Login</Button>
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
    // <Label sm={3}></Label>
    return <FormGroup row>
      <Col sm={{size: 3, offset: 5}}>
        <Button
          id="newUser"
          color="link"
          title="Go to Registration"
          className="float-right"
          ><Link to="/register" className="text-success">New User?</Link>
        </Button>
        <Button
          id="forgotPassword"
          color="link"
          title="Forgot Password"
          className="float-left"
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
    },
    clearAlert: () => {
      dispatch(alertActions.clear())
    }
  }
}

// const connectedLoginPage = connect(mapStateToProps, mapDispatchToProps)(Login)
// export default { connectedLoginPage as LoginPage } // exports connected component; cannot be used in unit testing

export default connect(mapStateToProps, mapDispatchToProps)(Login)

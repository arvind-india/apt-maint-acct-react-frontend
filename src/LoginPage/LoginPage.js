import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
          Form,
          Button,
          FormGroup,
          FormControl,
          HelpBlock,
          ControlLabel,
          Col
        } from 'react-bootstrap'

import { userActions } from '../_actions'

class LoginPage extends React.Component {
  constructor(props) {
    super(props)

    // reset login status
    this.props.dispatch(userActions.logout())

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
    const { dispatch } = this.props
    if(email && password) {
      dispatch(userActions.login(email, password))
    }
  }
  render() {
    const { email, password, submitted } = this.state
    return (
      <div className="col-md-6 col-md-offset-3">
        <h2>Login</h2>
        <Form inline onSubmit={this.handleSubmit}>

          <FormGroup controlId="emailIden" validationState={submitted && !email ? 'error' : null}>
            <Col componentClass={ControlLabel} sm={2}>emailId</Col>
            <Col sm={10}>
              <FormControl
                type="email"
                name="email"
                placeholder="email id here"
                defaultValue={email}
                onChange={this.handleChange.bind(this)}
              />
            </Col>
            <Col smOffset={2} sm={10}>
              {submitted && !email && <HelpBlock>Email-id is required</HelpBlock>}
            </Col>
          </FormGroup>

          <FormGroup controlId="pass" validationState={submitted && !password ? 'error' : null}>
            <Col componentClass={ControlLabel} sm={2}>Password</Col>
            <Col sm={10}>
              <FormControl
                type="password"
                name="password"
                placeholder="email id here"
                defaultValue={password}
                onChange={this.handleChange.bind(this)}
              />
            </Col>
            <Col smOffset={2} sm={10}>
              {submitted && !email && <HelpBlock>Password is required</HelpBlock>}
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="submit" bsStyle="primary" bsSize="large">Login</Button>
              <Button bsStyle="link">
                <Link to="/register">Register</Link>
              </Button>
            </Col>
          </FormGroup>

        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication
  return {
    loggingIn
  }
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage)
export { connectedLoginPage as LoginPage }

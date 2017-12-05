import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
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
        <Form onSubmit={this.handleSubmit}>

          <FormGroup>
            <Label for="email" sm={2}>Email_Id</Label>
            <Col sm={10}>
              <Input
                type="email"
                name="email"
                placeholder="email id here"
                defaultValue={email}
                onChange={this.handleChange.bind(this)}
              />
            </Col>
            <Col smOffset={2} sm={10}>
              {submitted && !email && <FormFeedback>Email-id is required</FormFeedback>}
            </Col>
          </FormGroup>

          <FormGroup>
            <Label sm={2}>Password</Label>
            <Col sm={10}>
              <Input
                type="password"
                name="password"
                placeholder="password here"
                defaultValue={password}
                onChange={this.handleChange.bind(this)}
              />
            </Col>
            <Col smOffset={2} sm={10}>
              {submitted && !password && <FormFeedback>Password is required</FormFeedback>}
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="submit" color="primary" bsSize="large">Login</Button>
              <Button color="link">
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

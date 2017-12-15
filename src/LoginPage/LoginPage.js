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
    const { alert } = this.props

    return (
      <div>
        <h2 align="center">Login</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}

        <Form onSubmit={this.handleSubmit}>

          <FormGroup row>
            <Label for="email" sm={3}>Email_Id</Label>
            <Col sm={9}>
              <Input
                type="email"
                name="email"
                placeholder="email id here"
                defaultValue={email}
                onChange={this.handleChange.bind(this)}
              />
              {submitted && !email && <FormText color="danger">Email-id is required</FormText>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>Password</Label>
            <Col sm={9}>
              <Input
                type="password"
                name="password"
                placeholder="password here"
                defaultValue={password}
                onChange={this.handleChange.bind(this)}
              />
              {submitted && !password && <FormText color="danger">Password is required</FormText>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}></Label>
            <Col smoffset={3} sm={9}>
              <Button type="submit" color="primary" bssize="large">Login</Button>
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
  const { alert } = state
  const { loggingIn } = state.authentication
  return {
    alert,
    loggingIn
  }
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage)
export { connectedLoginPage as LoginPage }

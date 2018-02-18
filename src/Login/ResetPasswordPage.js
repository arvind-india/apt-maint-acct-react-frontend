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

class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        password: '',
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
    event.preventDefault()
    this.setState({ submitted: true })
    const { user, confirmPassword } = this.state
    const { dispatch, location } = this.props
console.log('Reset password token: ', location)
    if(user.password &&
        confirmPassword &&
        location.state.token &&
        user.password === confirmPassword
    ) {
      dispatch(userActions.resetPassword(user.password, token))
    } else {
      dispatch(alertActions.error('Missing Data...'))
    }
  }
  render() {
    const { alert } = this.props
    return (
      <div>
        <h2 align="center">Reset Password</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <Form onSubmit={this.handleSubmit}>
          { this.password() }
          { this.repeatPassword() }
          { this.buttons() }
        </Form>
      </div>
    )
  }
  password() {
    const { submitted, user } = this.state
    return <FormGroup row>
      <Label sm={3}>Password</Label>
      <Col sm={9}>
        <Input
          type="password"
          name="password"
          placeholder="password here"
          onChange={this.handleChange}
        />
        {submitted && !user.password && <FormText color="danger">Password is required</FormText>}
      </Col>
    </FormGroup>
  }
  repeatPassword() {
    const { submitted, user, confirmPassword } = this.state
    return <FormGroup row>
      <Label sm={3}>Repeat_Password</Label>
      <Col sm={9}>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Repeat password here"
          onChange={this.handleConfirmPasswordChange}
        />
        {submitted && !confirmPassword && <FormText color="danger">Repeat Password is required</FormText>}
        {user.password && confirmPassword && user.password !== confirmPassword && <FormText color="danger">Password do NOT matchG</FormText>}
      </Col>
    </FormGroup>
  }

  buttons() {
    return <FormGroup row>
      <Label sm={3}></Label>
      <Col smoffset={3} sm={9}>
        <Button type="submit" color="primary" title="Reset Password">Reset</Button>
        <Button color="link">
          <Link to="/login" className="text-danger" title="Go to home">Cancel</Link>
        </Button>
        <SocialLoginPage/>
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

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage)
export { connectedRegisterPage as RegisterPage }

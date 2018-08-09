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
import { FlashMessage } from '../_components'

export class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: '',
      submitted: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(event) {
    const { name, value } = event.target
    this.setState({
        [name]: value
    })
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })
    const { password, confirmPassword } = this.state
    const { match } = this.props
    if(password &&
        confirmPassword &&
        match.params.token &&
        password === confirmPassword
    ) {
      this.props.resetPassword(password, match.params.token)
    } else {
      this.props.error('Missing Date...')
    }
  }
  render() {
    const { alert } = this.props
    return (
      <div>
        <h2 align="center">Reset Password</h2>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        <Form id="resetPasswordForm" onSubmit={this.handleSubmit}>
          { this.password() }
          { this.repeatPassword() }
          { this.buttons() }
        </Form>
      </div>
    )
  }
  password() {
    const { submitted, password } = this.state
    return <FormGroup>
      <Col sm={{size: 4, offset: 4}}>
        {password && <Label for="password" size="sm" className="formLabel">New password</Label>}
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="New password"
          onChange={this.handleChange}
        />
        {submitted && !password && <FormText color="danger">Password is required</FormText>}
      </Col>
    </FormGroup>
  }
  repeatPassword() {
    const { submitted, password, confirmPassword } = this.state
    return <FormGroup>
      <Col sm={{size: 4, offset: 4}}>
        { confirmPassword && <Label for="confirmPassword" size="sm" className="formLabel">Repeat new password</Label>}
        <Input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Repeat new password"
          onChange={this.handleChange}
        />
        {submitted && !confirmPassword && <FormText color="danger">Repeat Password is required</FormText>}
        {password && confirmPassword && password !== confirmPassword && <FormText color="danger">Password do NOT matchG</FormText>}
      </Col>
    </FormGroup>
  }

  buttons() {
    return <FormGroup>
      <Col sm={{size: 4, offset: 4}}>
        <Button type="submit" color="primary" title="Reset Password">Submit</Button>
        <Button color="link">
          <Link to="/login" className="text-danger" title="Go to home">Cancel</Link>
        </Button>
      </Col>
    </FormGroup>
  }

}

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: (password, token) => {
      dispatch(userActions.resetPassword(password, token))
    },
    error: (msg) => {
      dispatch(alertActions.error(msg))
    }
  }
}

function mapStateToProps(state) {
  const { alert } = state
  return {
    alert
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)

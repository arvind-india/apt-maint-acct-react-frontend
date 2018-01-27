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

class RegisterPage extends React.Component {
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
    event.preventDefault()
    this.setState({ submitted: true })
    const { user, confirmPassword } = this.state
    const { dispatch } = this.props
    if(user.name &&
        user.first_name &&
        user.last_name &&
        user.email &&
        user.password &&
        confirmPassword &&
        user.password === confirmPassword
      ) {
          dispatch(userActions.register(user))
        } else {
          dispatch(alertActions.error('Missing data...'))
        }
  }
  render() {

    const { user, submitted, confirmPassword } = this.state
    const { alert } = this.props

    return (

      <div>

        <h2 align="center">Register</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <Form onSubmit={this.handleSubmit}>

          <FormGroup row>
            <Label sm={3}>UserName</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="name"
                placeholder="User name here"
                onChange={this.handleChange}
              />
              {submitted && !user.name && <FormText color="danger">UserName is required</FormText>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>FirstName</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="first_name"
                placeholder="First name here"
                onChange={this.handleChange}
              />
              {submitted && !user.first_name && <FormText color="danger">First Name is required</FormText>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>LastName</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="last_name"
                placeholder="Last name here"
                onChange={this.handleChange}
              />
              {submitted && !user.last_name && <FormText color="danger">Last Name is required</FormText>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>Email_Id</Label>
            <Col sm={9}>
              <Input
                type="email"
                name="email"
                placeholder="email id here"
                onChange={this.handleChange}
              />
              {submitted && !user.email && <FormText color="danger">Email-id is required</FormText>}
            </Col>
          </FormGroup>

          <FormGroup row>
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

          <FormGroup row>
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

          <FormGroup row>
            <Label sm={3}></Label>
            <Col smoffset={3} sm={9}>
              <Button type="submit" color="primary">Register</Button>
              <Button color="link">
                <Link to="/login">Cancel</Link>
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
  const { registering } = state.registration
  return {
    alert,
    registering
  }
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage)
export { connectedRegisterPage as RegisterPage }

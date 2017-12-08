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
      confirmPassword: event.target
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
        }
  }
  render() {

    const { user, submitted, confirmPassword } = this.state

    return (

      <div>

        <h2 align="center">Register</h2>

        <Form onSubmit={this.handleSubmit}>

          <FormGroup row>
            <Label sm={3}>UserName</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="name"
                placeholder="User name here"
                defaultValue={user.name}
                onChange={this.handleChange}
              />
            </Col>
            <Col smoffset={3} sm={9}>
              {submitted && !user.name && <FormFeedback>User Name is required</FormFeedback>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>FirstName</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="first_name"
                placeholder="First name here"
                defaultValue={user.first_name}
                onChange={this.handleChange}
              />
            </Col>
            <Col smoffset={3} sm={9}>
              {submitted && !user.first_name && <FormFeedback>First Name is required</FormFeedback>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>LastName</Label>
            <Col sm={9}>
              <Input
                type="text"
                name="last_name"
                placeholder="Last name here"
                defaultValue={user.last_name}
                onChange={this.handleChange}
              />
            </Col>
            <Col smoffset={3} sm={9}>
              {submitted && !user.last_name && <FormFeedback>Last Name is required</FormFeedback>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>Email_Id</Label>
            <Col sm={9}>
              <Input
                type="email"
                name="email"
                placeholder="email id here"
                defaultValue={user.email}
                onChange={this.handleChange.bind(this)}
              />
            </Col>
            <Col smoffset={3} sm={9}>
              {submitted && !user.email && <FormFeedback>Email-id is required</FormFeedback>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>Password</Label>
            <Col sm={9}>
              <Input
                type="password"
                name="password"
                placeholder="password here"
                defaultValue={user.password}
                onChange={this.handleChange.bind(this)}
              />
            </Col>
            <Col smoffset={3} sm={9}>
              {submitted && !user.password && <FormFeedback>Password is required</FormFeedback>}
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm={3}>Repeat_Password</Label>
            <Col sm={9}>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Repeat password here"
                defaultValue={confirmPassword}
                onChange={this.handleConfirmPasswordChange.bind(this)}
              />
            </Col>
            <Col smoffset={3} sm={9}>
              {submitted && !confirmPassword && <FormFeedback>Repeat Password is required</FormFeedback>}
              {user.password && confirmPassword && user.password !== confirmPassword && <FormFeedback>Passwords are NOT MATCHING</FormFeedback>}
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
  const { registering } = state.registration
  return {
    registering
  }
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage)
export { connectedRegisterPage as RegisterPage }

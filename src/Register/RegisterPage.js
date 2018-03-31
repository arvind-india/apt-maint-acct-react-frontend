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
    //const { user, confirmPassword } = this.state
    //const { dispatch } = this.props
/*    if(user.name &&
        user.first_name &&
        user.last_name &&
        user.email &&
        user.password &&
        confirmPassword &&
        user.password === confirmPassword
      ) {
          //dispatch(userActions.register(user))
          this.props.register(user)
        } else {
          //dispatch(alertActions.error('Missing data...'))
          this.props.error('Missing data...')
        } */
  }
  render() {
    // const { user, submitted, confirmPassword } = this.state
    const { alert } = this.props
    return (
      <div>
        <h2 align="center">Register</h2>
        { alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div> }
        { this.validateForm() }
        <Form id="registerForm" onSubmit={this.handleSubmit}>
          { this.userName() }
          { this.firstName() }
          { this.lastName() }
          { this.email() }
          { this.password() }
          { this.repeatPassword() }
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
      <Label sm={{size: 1, offset: 4}}>UserName</Label>
      <Col sm={3}>
        <Input
          id="userName"
          type="text"
          name="name"
          placeholder="User name here"
          onChange={this.handleChange}
        />
        {submitted && !user.name && <FormText color="danger">UserName is required</FormText>}
      </Col>
    </FormGroup>
  }
  firstName() {
    const { submitted, user } = this.state
    return <FormGroup row>
      <Label sm={{size: 1, offset: 4}}>FirstName</Label>
      <Col sm={3}>
        <Input
          id="firstName"
          type="text"
          name="first_name"
          placeholder="First name here"
          onChange={this.handleChange}
        />
        {submitted && !user.first_name && <FormText color="danger">First Name is required</FormText>}
      </Col>
    </FormGroup>
  }
  lastName() {
    const { submitted, user } = this.state
    return <FormGroup row>
      <Label sm={{size: 1, offset: 4}}>LastName</Label>
      <Col sm={3}>
        <Input
          id="lastName"
          type="text"
          name="last_name"
          placeholder="Last name here"
          onChange={this.handleChange}
        />
        {submitted && !user.last_name && <FormText color="danger">Last Name is required</FormText>}
      </Col>
    </FormGroup>
  }

  email() {
    const { submitted, user } = this.state
    return <FormGroup row>
      <Label sm={{size: 1, offset: 4}}>Email_Id</Label>
      <Col sm={3}>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="email id here"
          onChange={this.handleChange}
        />
        {submitted && !user.email && <FormText color="danger">Email-id is required</FormText>}
      </Col>
    </FormGroup>
  }
  password() {
    const { submitted, user } = this.state
    return <FormGroup row>
      <Label sm={{size: 1, offset: 4}}>Password</Label>
      <Col sm={3}>
        <Input
          id="password"
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
      <Label sm={{size: 1, offset: 4}} title="Repeat password">Repeat_Pwd</Label>
      <Col sm={3}>
        <Input
          id="confirmPassword"
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
      <Col sm={{size: 3, offset: 5}}>
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

//const connectedRegisterPage = connect(mapStateToProps)(RegisterPage)
//export { connectedRegisterPage as RegisterPage }
export default connect(mapStateToProps, mapDispatchToProps)(Register)

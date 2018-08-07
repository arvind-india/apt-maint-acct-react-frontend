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
import { FlashMessage } from '../_components'


export class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    // reset login status
    this.props.logout()
    this.state = {
      email: '',
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
    const { alert } = this.props
    alert.message = '' // reset any existing alert message
    e.preventDefault()
    this.setState({ submitted: true })
    const { email } = this.state
    if(email) {
      this.props.forgotPassword(email)
    }
  }
  render() {
    const { alert } = this.props
    return (
      <div>
        <h2 align="center">Forgot Password</h2>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        <Form id="forgotPasswordForm" onSubmit={this.handleSubmit}>
          { this.emailId() }
          { this.buttons() }
        </Form>
      </div>
    )
  }

  emailId() {
    const { email, submitted } = this.state
    return <FormGroup>
      <Col sm={{size: 4, offset: 4}}>
        { email && <Label for="email" size="sm" className="formLabel">email id</Label> }
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="email id"
          defaultValue={email}
          onChange={this.handleChange.bind(this)}
        />
        {submitted && !email && <FormText color="danger">Email-id is required</FormText>}
      </Col>
    </FormGroup>
  }

  buttons() {
    return <FormGroup>
      <Col sm={{size: 4, offset: 4}}>
        <Button type="submit" color="primary" bssize="large" title="Go to App">Submit</Button>
        <Button color="link" title="Go to home">
          <Link to="/home" className="text-danger" >Cancel</Link>
        </Button>
      </Col>
    </FormGroup>
  }

}

function mapStateToProps(state) {
  const { alert } = state
  return {
    alert
  }
}

function mapDispatchToProps(dispatch) {
  return {
    forgotPassword: (email) => {
      dispatch(userActions.forgotPassword(email))
    },
    logout: () => {
      dispatch(userActions.logout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)

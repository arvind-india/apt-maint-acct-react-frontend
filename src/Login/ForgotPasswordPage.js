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


class ForgotPasswordPage extends React.Component {
  constructor(props) {
    super(props)
    // reset login status
    this.props.dispatch(userActions.logout())
    this.props.dispatch(alertActions.clear())  // clear alert messages from other pages
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
    e.preventDefault()
    this.setState({ submitted: true })
    const { email } = this.state
    const { dispatch } = this.props
    if(email) {
      dispatch(userActions.forgotPassword(email))
    }
  }
  render() {
    const { alert } = this.props
    return (
      <div>
        <h2 align="center">Forgot Password</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <Form onSubmit={this.handleSubmit}>
          { this.emailId() }
          { this.buttons() }
        </Form>
      </div>
    )
  }

  emailId() {
    const { email, submitted } = this.state
    return <FormGroup row>
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
  }

  buttons() {
    return <FormGroup row>
      <Label sm={3}></Label>
      <Col smoffset={3} sm={9}>
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

const connectedForgotPasswordPage = connect(mapStateToProps)(ForgotPasswordPage)
export { connectedForgotPasswordPage as ForgotPasswordPage }

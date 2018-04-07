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
/*    this.props.clearAlert() */
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
    return <FormGroup row>
      <Label for="email" sm={3}>Email_Id</Label>
      <Col sm={9}>
        <Input
          id="email"
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

function mapDispatchToProps(dispatch) {
  return {
    forgotPassword: (email) => {
      dispatch(userActions.forgotPassword(email))
    },
    logout: () => {
      dispatch(userActions.logout())
    }
    /*,
    clearAlert: () => {
      dispatch(alertActions.clear())
    }  */
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)

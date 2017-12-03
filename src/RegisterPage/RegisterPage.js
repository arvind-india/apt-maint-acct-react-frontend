import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

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
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { user } = this.state
    const { dispatch } = this.props
    if(user.name &&
        user.first_name &&
        user.last_name &&
        user.email &&
        user.password) {
          dispatch(userActions.register(user))
        }
  }
  render() {
    const { user, submitted } = this.state
    return (
      <div className="col-md-6 col-md-offset-3">
        <h2>Register</h2>
        <form name="form" onSubmit={this.handleSubmit}>

          <div className={'form-group' + (submitted && !user.name ? ' has-error' : '')}>
            <label htmlFor="name">Username</label>
            <input type="text" className="form-control" name="name" value={user.name} onChange={this.handleChange} />
            {submitted && !user.name && <div className="help-block">Username is required</div>}
          </div>

          <div className={'form-group' + (submitted && !user.first_name ? ' has-error': '')}>
            <label htmlFor="first_name">First Name</label>
            <input type="text" className="form-control" name="first_name" value={user.first_name} onChange={this.handleChange} />
            {submitted && !user.first_name && <div className="help-block">First name is required</div>}
          </div>

          <div className={'form-group' + (submitted && !user.last_name ? ' has-error' : '')}>
            <label htmlFor="last_name">Last Name</label>
            <input type="text" className="form-control" name="last_name" value={user.last_name} onChange={this.handleChange} />
            {submitted && !user.last_name && <div className="help-block">Last Name is required</div>}
          </div>

          <div className={'form-group' + (submitted && !user.email ? ' has-error' : '')}>
            <label htmlFor="email">Email</label>
            <input type="text" className="form-control" name="email" value={user.email} onChange={this.handleChange} />
            {submitted && !user.email && <div className="help-block">Email is required</div>}
          </div>

          <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" name="password" value={user.password} onChange={this.handleChange} />
            {submitted && !user.password && <div className="help-block">Password is required</div>}
          </div>

          <div className="form-group">
            <button className="btn btn-primary">Register</button>
            <Link to="/login" className="btn btn-link">Cancel</Link>
          </div>
        </form>
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

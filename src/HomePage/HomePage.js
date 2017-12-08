import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, UncontrolledAlert } from 'reactstrap'
import { userActions, alertActions } from '../_actions'
import { alertConstants } from '../_constants'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    // const { dispatch } = this.props
    this.handleLogout = this.handleLogout.bind(this)
    this.getColorFor = this.getColorFor.bind(this)
  }
  handleLogout() {
    this.props.dispatch(userActions.logout())
    this.props.dispatch(alertActions.error('You are now Logged out!!'))
  }
  getColorFor(alert) {
    switch(alert.type) {
      case alertConstants.SUCCESS:
        return "success";
      case alertConstants.ERROR:
        return "error";
      default:
        return "info"
    }
  }
  render() {
    const { user, alert } = this.props
    return (
      <div>
        {alert.message &&
          <UncontrolledAlert color={this.getColorFor(alert)}>{alert.message}</UncontrolledAlert>
        }
        <h1>{user && <div>Logged In</div>}</h1>
        <p>Welcome to Apartment Maintenance Tracking site</p>
        <p>
          {user
            ?<Button color="danger" onClick={this.handleLogout}>Logout</Button>
            :<Link to="/login">Login</Link>}
        </p>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { alert, authentication } = state
  const { user } = authentication
  return {
    alert,
    user
  }
}

const connectedHomePage = connect(mapStateToProps)(HomePage)
export { connectedHomePage as HomePage }

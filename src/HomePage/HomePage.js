import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import AlertContainer from 'react-alert'

// App specific
import { userActions, alertActions } from '../_actions'

class HomePage extends React.Component {
/*  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
  }
*/
  constructor(props) {
    super(props)
    // const { dispatch } = this.props
    this.handleLogout = this.handleLogout.bind(this)
  }
  handleLogout() {
    this.props.dispatch(userActions.logout())
    this.props.dispatch(alertActions.error('You are now Logged out!!'))
  }
  alertOptions = {
    offset: 14,
    position: 'top right',
    theme: 'dark',
    time: 3000,
    transition: 'scale'
  }
  show(message) {
    this.msg.show(message)
  }

  //         {alert.message && this.msg.show(alert.message)}
  render() {
    const { user, alert } = this.props
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions}/>
        {alert.message ? this.show(alert.message) : null}
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

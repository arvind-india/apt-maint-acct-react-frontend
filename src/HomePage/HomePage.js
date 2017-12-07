import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { userActions } from '../_actions'


class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.handleLogout = this.handleLogout.bind(this)
  }
  handleLogout() {
    this.props.dispatch(userActions.logout())
  }
  render() {
    const { user } = this.props
    return (
      <div>
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
  const { authentication } = state
  const { user } = authentication
  return {
    user
  }
}

const connectedHomePage = connect(mapStateToProps)(HomePage)
export { connectedHomePage as HomePage }

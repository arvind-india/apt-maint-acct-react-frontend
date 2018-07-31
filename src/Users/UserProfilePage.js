import React from 'react'
import { connect } from 'react-redux'

import jwtDecode from 'jwt-decode'

import { userActions as actions, alertActions } from '../_actions'
import { UserDetailsPage } from './'
import { FlashMessage } from '../_components'

export class UserProfile extends React.Component {

  componentDidMount() {
    this.props.getProfile(this.props.user.id)
  }
  render() {
    const { alert, userProfile } = this.props
    return (
      <div>
        { alert.message && <FlashMessage text={alert.message} color={alert.color} delay={4000}/> }
        { userProfile.loading && <em>User Profile is loading ....</em> }
        { userProfile.data && <UserDetailsPage location={this.location()} />}
      </div>
    )
  }

  location() {
    const { userProfile } = this.props
    return {
      state: {
        model: userProfile.data,
        title: 'User Profile',
        module: 'user-profile'
      },
      saveProfileChanges: this.props.saveProfileChanges
    }
  }

}

function mapStateToProps(state) {
  const { alert, authentication, authorizations, userProfile } = state
  const user = jwtDecode(authentication.user.id_token) // logged user
  const authzn = authorizations[module]
  return {
    user,
    alert,
    authzn,
    userProfile
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getProfile: (id) => {
      dispatch(actions.getProfile(id))
    },
    saveProfileChanges: (model) => {
      dispatch(actions.saveProfileChanges(model))
    },
    error: (msg) => {
      dispatch(alertActions.error(msg))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)

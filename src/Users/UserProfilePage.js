import React from 'react'
import { connect } from 'react-redux'

import jwtDecode from 'jwt-decode'

import { userActions as actions } from '../_actions'
import { UserDetailsPage } from './'
import { FlashMessage } from '../_components'

export class UserProfile extends React.Component {

  componentDidMount() {
    //const { dispatch, user } = this.props
    //console.log('user from jwt.......', user)
    //dispatch(actions.getProfile(user.id))
    console.log('user from jwt......', this.props.user)
    this.props.getProfile(this.props.user.id)
  }

  render() {
    const { alert, userProfile } = this.props
    return (
      <div>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={4000}/>}
        { userProfile.loading && <em>User Profile is loading ....</em> }
        { userProfile.error && <span className="text-danger">ERROR: {userProfile.error}</span> }
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
      }
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
    }
  }
}

// const connectedProfilePage = connect(mapStateToProps)(UserProfilePage)
// export { connectedProfilePage as UserProfilePage }

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)

import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'

import { userActions } from '../_actions'

class UserDetailsPage extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.props.dispatch(userActions.getById(this.props.match.params.id))
  }
  render() {
    const { userDetail, match } = this.props
    console.log('UserDetail: ', this.props)
    return (
      <div>
        <h3>User Details of {match.params.id}</h3>
      </div>
    )
  }
}


function mapStateToProps(state) {
  const { userDetail, authentication } = state
  const { user } = authentication
  return {
    user,
    userDetail
  }
}

const connectedDetailsPage = connect(mapStateToProps)(UserDetailsPage)
export { connectedDetailsPage as UserDetailsPage }

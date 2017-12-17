import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'

// Sub Layouts
import { UsersPage, UserDetailsPage } from '../UsersPage'

export const UserSubLayout = ({ match }) => (
  <div className="user-sub-layout">
    <div className="primary-content">
      <Switch>
        <Route path={match.path} exact component={UsersPage} />
        <Route path={`${match.path}/:userId`} component={UserDetailsPage} />
      </Switch>
    </div>
  </div>
)

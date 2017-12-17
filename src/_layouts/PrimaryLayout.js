import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { HomePage } from '../HomePage'

// Sub Layouts
import { UserSubLayout } from './UserSubLayout'

export const PrimaryLayout = ({match}) => (
  <div className="primary-layout">
    <main>
      <Switch>
        <Route path={`${match.path}`} exact component={HomePage} />
        <Route path={`${match.path}/users`} component={UserSubLayout} />
        <Redirect to={`${match.url}`} />
      </Switch>
    </main>
  </div>
)

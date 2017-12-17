import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

// pages
import { LoginPage } from '../LoginPage'
import { HomePage } from '../HomePage'
import { RegisterPage } from '../RegisterPage'

export const UnauthenticatedLayout = () => (
  <div className="unauthenticated-layout">
    {
      /* This is a general layout for all un-authenticated pages like login page,
       * forgot password, email-verified, etc...
       */
       /* <h1>Welcome to Eastgate!</h1> */
    }
    <Route exact path="/" component={HomePage} />
    <Route path="/home" component={HomePage} />
    <Route path="/register" component={RegisterPage} />
    <Switch>
      <Route path="/login" component={LoginPage}/>
      <Redirect to="/login"/>
    </Switch>
  </div>
)

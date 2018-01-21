import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table, Alert, UncontrolledAlert } from 'reactstrap'
import { Router, Route } from 'react-router-dom'

import {
  MdAdd,
  MdVisibility,
  MdDelete
} from 'react-icons/lib/md' // material design icons

import {
  Button
} from 'reactstrap'

import { history } from '../_helpers'
import { PrivateRoute, FlashMessage } from '../_components'
import { roleActions as actions, alertActions } from '../_actions'
import { RoleDetailsPage as detailsPage } from './RoleDetailsPage'

let url = '/roles'

class RolesToPermissionsLinkPage extends React.Component {

}

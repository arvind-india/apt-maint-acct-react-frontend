import { combineReducers } from 'redux'

import { authentication } from './authentication.reducer'
import { authorizations } from './authorizations.reducer'
import { registration } from './registration.reducer'
import { alert } from './alert.reducer'

import { users } from './users.reducer'
import { userDetails } from './userDetails.reducer'

import { roles } from './roles.reducer'
import { roleDetails } from './roleDetails.reducer'

import { permissions } from './permissions.reducer'
import { permissionDetails } from './permissionDetails.reducer'

import { rolesToPermissions } from './rolesToPermissions.reducer'
import { usersToRoles } from './usersToRoles.reducer'

import { flats } from './flats.reducer'
import { flatDetails } from './flatDetails.reducer'

import { residents } from './residents.reducer'
import { residentDetails } from './residentDetails.reducer'

const rootReducer = combineReducers({
  authentication,
  authorizations,
  registration,
  alert,
  users,
  userDetails,
  roles,
  roleDetails,
  permissions,
  permissionDetails,
  rolesToPermissions,
  usersToRoles,
  flats,
  flatDetails,
  residents,
  residentDetails
})

export default rootReducer

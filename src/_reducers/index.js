import { combineReducers } from 'redux'

import { authentication } from './authentication.reducer'
import { authorizations } from './authorizations.reducer'
import { registration } from './registration.reducer'
import { alert } from './alert.reducer'

import { users } from './users.reducer'
import { userDetails } from './userDetails.reducer'
import { userProfile } from './userProfile.reducer'

import { roles } from './roles.reducer'
import { roleDetails } from './roleDetails.reducer'

import { permissions } from './permissions.reducer'
import { permissionDetails } from './permissionDetails.reducer'

import { flatsToResidents } from './flatsToResidents.reducer'
import { rolesToPermissions } from './rolesToPermissions.reducer'
import { usersToRoles } from './usersToRoles.reducer'

import { flats } from './flats.reducer'
import { flatDetails } from './flatDetails.reducer'

import { residents } from './residents.reducer'
import { residentDetails } from './residentDetails.reducer'

import { accounts } from './accounts.reducer'
import { accountDetails } from './accountDetails.reducer'
import { summaries } from './summaries.reducer'

const rootReducer = combineReducers({
  authentication,
  authorizations,
  registration,
  alert,
  users,
  userDetails,
  userProfile,
  roles,
  roleDetails,
  permissions,
  permissionDetails,
  flatsToResidents,
  rolesToPermissions,
  usersToRoles,
  flats,
  flatDetails,
  residents,
  residentDetails,
  accounts,
  accountDetails,
  summaries
})

export default rootReducer

import { combineReducers } from 'redux'

import { authentication } from './authentication.reducer'
import { registration } from './registration.reducer'
import { alert } from './alert.reducer'

import { users } from './users.reducer'
import { userDetails } from './userDetails.reducer'

import { roles } from './roles.reducer'
import { roleDetails } from './roleDetails.reducer'

import { permissions } from './permissions.reducer'
import { permissionDetails } from './permissionDetails.reducer'

import { rolesToPermissions } from './rolesToPermissions.reducer'

const rootReducer = combineReducers({
  authentication,
  registration,
  alert,
  users,
  userDetails,
  roles,
  roleDetails,
  permissions,
  permissionDetails,
  rolesToPermissions
})

export default rootReducer

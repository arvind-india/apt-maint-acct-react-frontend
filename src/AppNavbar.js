import React from 'react'
import { connect } from 'react-redux'
import { NavLink as NavLinkRRD } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import {
  FaSignIn,
  FaSignOut,
  FaBook,
  FaArrowsH,
  FaInr
} from 'react-icons/lib/fa' // font-awesome icons
import {
  MdHome,
  MdPerson,
  MdGroup,
  MdSettingsApplications,
  MdVpnKey,
  MdInfoOutline,
  MdPersonAdd,
  MdLock,
  MdAttachment,
  MdLocationCity,
  MdAccountCircle,
  MdList,
  MdViewHeadline,
  MdEdit
} from 'react-icons/lib/md' // material design icons

import { userActions } from './_actions'
import { history } from './_helpers'
import { texts } from './_constants'

class AppNavbar extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false,
      isLoggedIn: false
    }
    this.handleLogout = this.handleLogout.bind(this)
  }

  render() {
    const { user } = this.props
    const baz = () => <NavLink
                        className="navbar-brand"
                        tag={NavLinkRRD}
                        to="/"
                        ><img src='rag.png' height="36" width="36" alt="RGN logo"/> {texts.brand}</NavLink>
// <Navbar color="light" light expand="md">
// <Navbar color="dark" className="navbar-dark navbar-expand-sm">
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand tag={baz}/>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              { this.showHome() }
              {user && this.showAccounts()}
              {user && this.showSettings()}
              {user
                ? this.showLogout(user)
                : this.showLogin()}
              {!user && this.showRegister()}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }

  showHome() {
    return <NavItem>
      <NavLink
        tag={NavLinkRRD}
        to="/home"
        activeClassName="selected"
        ><MdHome/> Home </NavLink>
    </NavItem>
  }
  showAbout() {
    return <NavItem>
      <NavLink
        tag={NavLinkRRD}
        to="/about"
        activeClassName="selected"
        ><MdInfoOutline/> About </NavLink>
    </NavItem>
  }
  // Accounts Menu
  showAccounts() {
    let modules = ['accounts', 'account-summary']
    if( !this.authorizesAnyOf(modules) ) return ''
    return  <UncontrolledDropdown nav>
              <DropdownToggle nav caret>
                <FaBook/> Accounts
              </DropdownToggle>
              <DropdownMenu>
                { this.accountsLink() }
                { this.monthlyAccountsLink() }
                { this.accountSummaryLink() }
              </DropdownMenu>
            </UncontrolledDropdown>
  }
  // Accounts -> All Records
  accountsLink() {
    if( !this.authorizes('accounts') ) return ''
    return <DropdownItem className="menuItem">
      <NavLink
        tag={NavLinkRRD}
        to="/accounts"
        title="Show Accounts (all records)"
        ><MdList/> All Records</NavLink>
    </DropdownItem>
  }
  // Accounts -> Monthly Accounts
  monthlyAccountsLink() {
    if( !this.authorizes('accounts') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/monthly-accounts"
        title="Monthly Account"><FaInr/>Monthly Accounts</NavLink>
    </DropdownItem>
  }
  // Accounts -> Summary
  accountSummaryLink() {
    if( !this.authorizes('account-summary') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/accounts-summary"
        title="Show Accounts Summary"
        ><MdViewHeadline/> Summary</NavLink>
    </DropdownItem>
  }

  // Settings Menu
  showSettings() {
    let flatLinks = ['residents', 'flats', 'flats-resident']
    let durationLinks = ['durations']
    let hasDurationLinks = this.authorizesAnyOf(durationLinks)
    let roleLinks = ['roles', 'permissions', 'roles-permissions']
    let hasRoleLinks = this.authorizesAnyOf(roleLinks)
    let userLinks = ['users', 'users-roles']
    let hasUserLinks = this.authorizesAnyOf(userLinks);
    let modules = flatLinks.concat(durationLinks).concat(roleLinks).concat(userLinks)
    if ( !this.authorizesAnyOf(modules) ) return ''

    return  <UncontrolledDropdown nav>
        <DropdownToggle nav caret>
          <MdSettingsApplications/> Settings
        </DropdownToggle>
        <DropdownMenu>
          { this.residentsLink() }
          { this.flatsLink() }
          { this.flatsToResidentsLink() }
          { hasDurationLinks && <DropdownItem divider /> }
          { this.durationsLink() }
          { hasRoleLinks && <DropdownItem divider /> }
          { this.rolesLink() }
          { this.permissionsLink() }
          { this.rolesToPermissionsLink() }
          { hasUserLinks && <DropdownItem divider /> }
          { this.usersLink() }
          { this.usersToRolesLink() }
        </DropdownMenu>
      </UncontrolledDropdown>
  }
  // Settings -> Residents
  residentsLink() {
    if( !this.authorizes('residents') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/residents"
        ><MdAccountCircle/> Residents</NavLink>
    </DropdownItem>
  }
  // Settings -> Flats
  flatsLink() {
    if( !this.authorizes('flats') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/flats"
        ><MdLocationCity/> Flats</NavLink>
    </DropdownItem>
  }
  // Settings -> Flats-Residents
  flatsToResidentsLink() {
    if( !this.authorizes('flats-residents') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/flatstoresidents"
        ><MdAttachment/> Flats-Residents</NavLink>
    </DropdownItem>
  }
  // Settings -> Durations
  durationsLink() {
    if( !this.authorizes('durations') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/durations"
        ><FaArrowsH/> Durations</NavLink>
    </DropdownItem>
  }
  // Settings -> Roles
  rolesLink() {
    if( !this.authorizes('roles') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/roles"
        ><MdVpnKey/> Roles</NavLink>
    </DropdownItem>
  }
  // Settings -> Permissions
  permissionsLink() {
    if( !this.authorizes('permissions') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/permissions"
        ><MdLock/> Permissions</NavLink>
    </DropdownItem>
  }
  // Settings -> Roles-Permissions
  rolesToPermissionsLink() {
    if( !this.authorizes('roles-permissions') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/rolestopermissions"
        ><MdAttachment/> Roles-Permissions</NavLink>
    </DropdownItem>
  }
  // Settings -> Users
  usersLink() {
    if( !this.authorizes('users') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/users"
        ><MdGroup /> Users</NavLink>
    </DropdownItem>
  }
  // Settings -> users-roles
  usersToRolesLink() {
    if( !this.authorizes('users-roles') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to="/usersToRoles"
        ><MdAttachment/> Users-Roles</NavLink>
    </DropdownItem>
  }
  authorizes(module){
    const { authorizations } = this.props

    let authzn = authorizations[module]
    if(!authzn) return false
    let result = authzn.allowsAdd ||
                 authzn.allowsView ||
                 authzn.allowsEdit ||
                 authzn.allowsDelete
    return result
  }
  // Check whether any of the modules in the array is authorized
  authorizesAnyOf(modules=[]) {
    let results = modules.filter( each => this.authorizes(each) );
    console.log('Modules are: ', modules)
    console.log('Authorization results: ',results)
    return results.length > 0
  }
  showLogin() {
    return <NavItem>
              <NavLink
                tag={NavLinkRRD}
                to="/login"
                activeClassName="selected"
                ><FaSignIn /> Login</NavLink>
           </NavItem>
  }
  showRegister() {
    return <NavItem>
              <NavLink
                tag={NavLinkRRD}
                to="/register"
                activeClassName="selected"
                ><MdPersonAdd/> Register</NavLink>
           </NavItem>
  }
  showLogout(user) {
    return <UncontrolledDropdown nav>
            <DropdownToggle nav caret>
              <MdPerson /> {this.decode(user).name}
            </DropdownToggle>
            <DropdownMenu>
              { this.profileLink() }
              { this.logoutLink() }
            </DropdownMenu>
          </UncontrolledDropdown>
  }
  profileLink() {
    if( !this.authorizes('user-profile') ) return ''
    return <DropdownItem>
      <NavLink
        tag={NavLinkRRD}
        to='/userprofile'
        ><MdEdit/> Profile</NavLink>
    </DropdownItem>
  }
  logoutLink() {
    return <DropdownItem>
      <NavLink
        onClick={this.handleLogout}
        ><FaSignOut/> Logout</NavLink>
    </DropdownItem>
  }
  handleLogout() {
    this.props.dispatch(userActions.logout())
    history.push('/home')
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  decode(user) {
    //if(user.id_token) console.log('JWT Token: ', jwtDecode(user.id_token))
    return user.id_token
      ? jwtDecode(user.id_token)
      : {name: 'Guest!'}
  }

}

function mapStateToProps(state) {
  const { authentication, authenticationSocial, authorizations } = state
  let user = authentication.user || authenticationSocial.user
  return {
    user,
    authorizations
  }
}
const connectedAppNavbar = connect(mapStateToProps)(AppNavbar)
export { connectedAppNavbar as AppNavbar}

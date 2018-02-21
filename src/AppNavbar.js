import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
  FaBuildingO,
  FaSignIn,
  FaSignOut,
  FaBook
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
  MdFilterList,
  MdViewHeadline,
  MdEdit
} from 'react-icons/lib/md' // material design icons

import { userActions } from './_actions'
import { history } from './_helpers'

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
    console.log('AppNavBar User: ', user)
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/home"><FaBuildingO/> Apartment Maintenance</NavbarBrand>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/home"><MdHome/> Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/about"><MdInfoOutline/> About</NavLink>
              </NavItem>
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

  showAccounts() {
    return  <UncontrolledDropdown nav>
              <DropdownToggle nav caret>
                <FaBook/> Accounts
              </DropdownToggle>
              <DropdownMenu>
                { this.accountsLink() }
                { this.accountSummaryLink() }
              </DropdownMenu>
            </UncontrolledDropdown>
  }

  accountsLink() {
    if( !this.authorizes('accounts') ) return ''
    return <DropdownItem>
      <NavLink href="/accounts" title="Show Accounts (all records)"><MdList/> All Records</NavLink>
    </DropdownItem>
  }
  accountsMonthwiseLink() {
    return <DropdownItem>
      <NavLink href="/accountsMonthwise" title="Show Accounts Monthwise"><MdFilterList/> Monthwise</NavLink>
    </DropdownItem>
  }
  accountSummaryLink() {
    if( !this.authorizes('account-summary') ) return ''
    return <DropdownItem>
      <NavLink href="/accounts-summary" title="Show Accounts Summary"><MdViewHeadline/> Summary</NavLink>
    </DropdownItem>
  }

  showSettings() {
    return  <UncontrolledDropdown nav>
        <DropdownToggle nav caret>
          <MdSettingsApplications/> Settings
        </DropdownToggle>
        <DropdownMenu>
          { this.residentsLink() }
          { this.flatsLink() }
          { this.flatsToResidentsLink() }
          <DropdownItem divider />
          { this.rolesLink() }
          { this.permissionsLink() }
          { this.rolesToPermissionsLink() }
          <DropdownItem divider />
          { this.usersLink() }
          { this.usersToRolesLink() }
        </DropdownMenu>
      </UncontrolledDropdown>
  }
  residentsLink() {
    if( !this.authorizes('residents') ) return ''
    return <DropdownItem>
      <NavLink href="/residents"><MdAccountCircle/> Residents</NavLink>
    </DropdownItem>
  }
  flatsLink() {
    if( !this.authorizes('flats') ) return ''
    return <DropdownItem>
      <NavLink href="/flats"><MdLocationCity/> Flats</NavLink>
    </DropdownItem>
  }
  flatsToResidentsLink() {
    if( !this.authorizes('flats-residents') ) return ''
    return <DropdownItem>
      <NavLink href="/flatstoresidents"><MdAttachment/> Flats-Residents</NavLink>
    </DropdownItem>
  }

  rolesLink() {
    if( !this.authorizes('roles') ) return ''
    return <DropdownItem>
      <NavLink href="/roles"><MdVpnKey/> Roles</NavLink>
    </DropdownItem>
  }
  permissionsLink() {
    if( !this.authorizes('permissions') ) return ''
    return <DropdownItem>
      <NavLink href="/permissions"><MdLock/> Permissions</NavLink>
    </DropdownItem>
  }
  rolesToPermissionsLink() {
    if( !this.authorizes('roles-permissions') ) return ''
    return <DropdownItem>
      <NavLink href="/rolestopermissions"><MdAttachment/> Roles-Permissions</NavLink>
    </DropdownItem>
  }
  usersLink() {
    if( !this.authorizes('users') ) return ''
    return <DropdownItem>
      <NavLink href="/users"><MdGroup /> Users</NavLink>
    </DropdownItem>
  }
  usersToRolesLink() {
    if( !this.authorizes('users-roles') ) return ''
    return <DropdownItem>
      <NavLink href="/usersToRoles"><MdAttachment/> Users-Roles</NavLink>
    </DropdownItem>
  }
  authorizes(module){
    const { authorizations } = this.props

    let authzn = authorizations[module]
    if(!authzn) return false
    console.log('authorizes.....', authzn)
    let result = authzn.allowsAdd ||
                 authzn.allowsView ||
                 authzn.allowsEdit ||
                 authzn.allowsDelete
    return result
  }

  showLogin() {
    // <NavLink href='/login'><FaSignIn/> Login</NavLink>
    return <NavItem>

              <Link to="/login"><FaSignIn /> Login</Link>
           </NavItem>
  }
  showRegister() {
    return <NavItem>
              <NavLink href="/register"><MdPersonAdd/> Register</NavLink>
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
      <NavLink href='/userprofile'><MdEdit/> Profile</NavLink>
    </DropdownItem>
  }
  logoutLink() {
    return <DropdownItem>
      <NavLink onClick={this.handleLogout}><FaSignOut/> Logout</NavLink>
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
    if(user.id_token) console.log('JWT Token: ', jwtDecode(user.id_token))
    return user.id_token
      ? jwtDecode(user.id_token)
      : {name: 'Guest!'}
  }

}

function mapStateToProps(state) {
  const { authentication, authenticationSocial, authorizations } = state
  //const { user } = authentication
  let user = authentication.user || authenticationSocial.user
  return {
    user,
    authorizations
  }
}
const connectedAppNavbar = connect(mapStateToProps)(AppNavbar)
export { connectedAppNavbar as AppNavbar}

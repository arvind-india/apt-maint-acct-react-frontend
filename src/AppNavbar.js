import React from 'react'
import { connect } from 'react-redux'
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
  FaSignOut
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
  MdAttachment
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
  showLogin() {
    return <NavItem>
              <NavLink href="/login"><FaSignIn/> Login</NavLink>
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
              <DropdownItem>
                <NavLink onClick={this.handleLogout}><FaSignOut/> Logout</NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
  }
  showSettings() {
    return  <UncontrolledDropdown nav>
              <DropdownToggle nav caret>
                <MdSettingsApplications/> Settings
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <NavLink href="/roles"><MdVpnKey/> Roles</NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink href="/permissions"><MdLock/> Permissions</NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink href="/rolestopermissions"><MdAttachment/> Roles-Permissions</NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink href="/users"><MdGroup /> Users</NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink href="/usersToRoles"><MdAttachment/> Users-Roles</NavLink>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
  }
  render() {
    const { user } = this.props
    console.log('AppNavBar User: ', user)
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/home"><FaBuildingO /> Apartment Maintenance</NavbarBrand>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/home"><MdHome/> Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/about"><MdInfoOutline/> About</NavLink>
              </NavItem>
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
}

function mapStateToProps(state) {
  const { authentication } = state
  const { user } = authentication
  return {
    user
  }
}
const connectedAppNavbar = connect(mapStateToProps)(AppNavbar)
export { connectedAppNavbar as AppNavbar}

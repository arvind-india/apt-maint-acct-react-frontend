import React from 'react'
import { connect } from 'react-redux'
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
import { Button } from 'reactstrap'

import { userActions } from './_actions'


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
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  render() {
    const { user } = this.props
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/home">Apt Maint</NavbarBrand>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/users">Users</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/mohankumaranna">Github</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                {user
                  ?<Button color="link" onClick={this.handleLogout}>Logout</Button>
                  :<NavLink href="/login">Login</NavLink>}
              </NavItem>
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

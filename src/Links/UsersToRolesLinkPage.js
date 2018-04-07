import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Input,
    Label
} from 'reactstrap'

import {
  MdHome,
  MdThumbUp,
  MdThumbDown
} from 'react-icons/lib/md' // material design icons

import {
  Button
} from 'reactstrap'

import { FlashMessage } from '../_components'
import { userActions, roleActions } from '../_actions'

let module = 'users-roles' // module name


export class UsersToRolesLink extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedOptionInLeftList: '',
      selectedOptionsInDList: [],
      selectedOptionsInAList: []
    }
    this.handleChangeInLeftList = this.handleChangeInLeftList.bind(this)
    this.handleChangeInDetachedList = this.handleChangeInDetachedList.bind(this)
    this.attachItems = this.attachItems.bind(this)
    this.handleChangeInAttachedList = this.handleChangeInAttachedList.bind(this)
    this.detachItems = this.detachItems.bind(this)
  }

  componentDidMount() {
    this.props.getAllUsers()
    this.props.getAllRoles()
  }

  render() {
    const { alert } = this.props
    return (
      <div>
        <h3>Users To Roles Link</h3>
        {alert.message && <FlashMessage text={alert.message} delay={2100}/>}
        {this.show()}
      </div>
    )
  }

  show() {
    return <div className="list-to-list">
      { this.showLeftLabel() }
      { this.showLeftInput() }
      { this.showLeftButton() }

      { this.showAttachedLabel() }
      { this.showAttachedInput() }
      { this.showDetachButton() }

      { this.showDetachedLabel() }
      { this.showDetachedInput() }
      { this.showAttachButton() }
    </div>
  }

  showLeftLabel() {
    return <Label
      for="leftItem"
      className="llabel"
      >Select an User</Label>
  }
  showLeftInput() {
    const { users } = this.props
    return <Input
      id="leftItem"
      type="select"
      name="leftItem"
      size="20"
      className="lselect"
      onChange={this.handleChangeInLeftList}
    >
    { users.items && users.items.map(each =>
      <option value={each.id} title={each.email} key={each.id}
        >{each.first_name?each.first_name:each.name}</option>)
    }
    </Input>
  }
  handleChangeInLeftList(event) {
    const { value } = event.target
    this.setState({
      selectedOptionInLeftList: value
    })

    this.props.getMyRoles(value)
  }
  showLeftButton() {
    return <div class="homeButton">
      <Button
        color="link"
      ><Link to="/home"><MdHome/> Home</Link></Button>
    </div>
  }

  showAttachedLabel() {
    return <Label
      for="attachedItems"
      className="alabel"
    >Assigned Roles</Label>
  }
  showAttachedInput() {
    const { usersToRoles } = this.props
    const { selectedOptionInLeftList } = this.state

    return <Input
      id="attachedItems"
      type="select"
      name="attachedItems"
      size="20"
      className="aselect"
      onChange={this.handleChangeInAttachedList}
      multiple
    >
    { selectedOptionInLeftList &&
      usersToRoles.items &&
      usersToRoles.items.map(each =>
      <option value={each.id} title={each.description} key={each.id}
        >{each.name} {each.inherits?' (inherits '+each.inherits+')':''}</option>)
    }
    </Input>
  }
  handleChangeInAttachedList(event) {
    const { selectedOptions } = event.target
    this.setState({
      selectedOptionsInAList: Array.from(selectedOptions)
    })
  }
  showDetachButton() {
    const { authzn } = this.props
    const { selectedOptionsInAList } = this.state

    return <Button
      id="detachButton"
      color="danger"
      className="dbutton"
      onClick={this.detachItems}
      disabled={selectedOptionsInAList.length === 0}
      hidden={!authzn.allowsEdit}
      title="Unassign selected roles"
    ><MdThumbDown/> Unassign</Button>
  }

  detachItems() {
    const { usersToRoles } = this.props
    const { selectedOptionsInAList, selectedOptionInLeftList } = this.state

    let id = selectedOptionInLeftList
    let ids_toBeRemoved = selectedOptionsInAList.map(e => e.value)
    let ids = usersToRoles.items.map(e => e.id.toString())
    let ids_toBeRetained = ids.filter(each => !ids_toBeRemoved.includes(each))

    this.props.updateMyRoles(id, ids_toBeRetained)
    this.setState({ selectedOptionsInAList: [] })
  }

  showDetachedLabel() {
    return <Label
      for="detachedItems"
      className="dlabel"
    >Available Roles</Label>
  }
  showDetachedInput() {
    const { usersToRoles, roles } = this.props
    const { selectedOptionInLeftList } = this.state
    let available = [];
    let grantedIDs = []
    if(usersToRoles.items) {
      grantedIDs = usersToRoles.items.map(each => each.id)
    }
    if(roles.items && selectedOptionInLeftList) {
      available = grantedIDs.length ?
        roles.items.filter(each => !grantedIDs.includes(each.id)) :
        roles.items
    }
    return <Input
      id="detachedItems"
      type="select"
      name="detachedItems"
      size="20"
      className="dselect"
      onChange={this.handleChangeInDetachedList}
      multiple
    >
    {
      available.map(each =>
      <option value={each.id} title={each.description} key={each.id}
        >{each.name} {each.inherits?' (inherits '+each.inherits+')':''}</option>)
    }
    </Input>
  }
  handleChangeInDetachedList(event){
    const { selectedOptions } = event.target
    this.setState({
      selectedOptionsInDList: Array.from(selectedOptions)
    })
  }
  showAttachButton() {
    const { authzn } = this.props
    const { selectedOptionsInDList } = this.state

    return <Button
      id="attachButton"
      color="success"
      className="abutton"
      onClick={this.attachItems}
      disabled={selectedOptionsInDList.length === 0}
      hidden={!authzn.allowsEdit}
      title="Assign selected roles"
    ><MdThumbUp/> Assign</Button>
  }

  attachItems() {
    const { usersToRoles } = this.props
    const { selectedOptionsInDList, selectedOptionInLeftList } = this.state

    let id = selectedOptionInLeftList
    let ids = usersToRoles.items.map(e => e.id)
    let ids_toBeAdded = selectedOptionsInDList.map(e => e.value)
    let new_ids = ids.concat(ids_toBeAdded)

    this.props.updateMyRoles(id, new_ids)
    this.setState({ selectedOptionsInDList: [] })
  }
}

function mapStateToProps(state) {
  const { alert, users, usersToRoles, roles, authorizations } = state
  const authzn = authorizations[module]
  return {
    alert,
    users,
    usersToRoles,
    roles,
    authzn
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllRoles: () => {
      dispatch(roleActions.getAll())
    },
    getAllUsers: () => {
      dispatch(userActions.getAll())
    },
    getMyRoles: (value) => {
      dispatch(userActions.getMyRoles(value))
    },
    updateMyRoles: (id, ids) => {
      dispatch(userActions.updateMyRoles(id, ids))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersToRolesLink)

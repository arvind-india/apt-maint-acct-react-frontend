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


class UsersToRolesLinkPage extends React.Component {

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
    this.props.dispatch(userActions.getAll())
    this.props.dispatch(roleActions.getAll())
  }

  render() {
    const { alert } = this.props
    return (
      <div>
        <h3>Users To Roles Link</h3>
        {alert.message && <FlashMessage text={alert.message} delay={5000}/>}
        {this.show()}
      </div>
    )
  }

  show() {
    return <div className="list-to-list">
      {this.showLeftList()}
      {this.showAttachedList()}
      {this.showDetachedList()}
    </div>
  }

  showLeftList() {
    const { users } = this.props
    return <div>
      <Label for="leftItem" className="llabel">Select an User</Label>
      <Input
        type="select"
        name="leftItem"
        id="leftItem"
        size="20"
        className="lselect"
        onChange={this.handleChangeInLeftList}
      >
      { users.items && users.items.map(each =>
        <option value={each.id} title={each.description} key={each.id}
          >{each.name}</option>)
      }
      </Input>
      <Button color="link" className="homeButton"><Link to="/home"><MdHome/> Home</Link></Button>
    </div>
  }

  handleChangeInLeftList(event) {
    const { value } = event.target
    this.setState({
      selectedOptionInLeftList: value
    })
    this.props.dispatch(roleActions.getMyPermissions(value))
  }

  showAttachedList() {
    const { rolesToPermissions, authzn } = this.props
    const { selectedOptionInLeftList, selectedOptionsInAList } = this.state
    return <div>
      <Label
        for="attachedItems"
        className="alabel"
      >Granted Permissions</Label>
      <Input
        type="select"
        name="attachedItems"
        id="attachedItems"
        size="20"
        className="aselect"
        onChange={this.handleChangeInAttachedList}
        multiple
      >
      { selectedOptionInLeftList &&
        rolesToPermissions.items &&
        rolesToPermissions.items.map(each =>
        <option value={each.id} title={each.description} key={each.id}
          >{each.operations} on {each.resource} {each.condition?' (restricted)':''}</option>)
      }
      </Input>
      <Button
        color="danger"
        className="dbutton"
        onClick={this.detachItems}
        disabled={selectedOptionsInAList.length === 0}
        hidden={!authzn.allowsEdit}
      ><MdThumbDown/> Revoke</Button>
    </div>
  }
  handleChangeInAttachedList(event) {
    const { selectedOptions } = event.target
    this.setState({
      selectedOptionsInAList: Array.from(selectedOptions)
    })
  }
  detachItems() {
    const { dispatch, rolesToPermissions } = this.props
    const { selectedOptionsInAList, selectedOptionInLeftList } = this.state

    let id = selectedOptionInLeftList
    let ids_toBeRemoved = selectedOptionsInAList.map(e => e.value)
    let ids = rolesToPermissions.items.map(e => e.id.toString())
    let ids_toBeRetained = ids.filter(each => !ids_toBeRemoved.includes(each))

    dispatch(roleActions.updateMyPermissions(id, ids_toBeRetained))
    this.setState({ selectedOptionsInAList: [] })
  }
  showDetachedList() {
    const { rolesToPermissions, permissions, authzn } = this.props
    const { selectedOptionInLeftList, selectedOptionsInDList } = this.state

    let available = [];
    let grantedIDs = []
    if(rolesToPermissions.items) {
      grantedIDs = rolesToPermissions.items.map(each => each.id)
    }
    if(permissions.items && selectedOptionInLeftList) {
      available = grantedIDs.length ?
        permissions.items.filter(each => !grantedIDs.includes(each.id)) :
        permissions.items
    }
    return <div>
      <Label
        for="detachedItems"
        className="dlabel"
      >Available Permissions</Label>
      <Input
        type="select"
        name="detachedItems"
        id="detachedItems"
        size="20"
        className="dselect"
        onChange={this.handleChangeInDetachedList}
        multiple
      >
      {
        available.map(each =>
        <option value={each.id} title={each.description} key={each.id}
          >{each.operations} on {each.resource} {each.condition?' (restricted)':''}</option>)
      }
      </Input>
      <Button
        color="success"
        className="abutton"
        onClick={this.attachItems}
        disabled={selectedOptionsInDList.length === 0}
        hidden={!authzn.allowsEdit}
      ><MdThumbUp/> Grant</Button>
    </div>
  }

  handleChangeInDetachedList(event){
    const { selectedOptions } = event.target
    this.setState({
      selectedOptionsInDList: Array.from(selectedOptions)
    })
  }
  attachItems() {
    const { dispatch, rolesToPermissions } = this.props
    const { selectedOptionsInDList, selectedOptionInLeftList } = this.state

    let id = selectedOptionInLeftList
    let ids = rolesToPermissions.items.map(e => e.id)
    let ids_toBeAdded = selectedOptionsInDList.map(e => e.value)
    let new_ids = ids.concat(ids_toBeAdded)

    dispatch(roleActions.updateMyPermissions(id, new_ids))
    this.setState({ selectedOptionsInDList: [] })
  }
}

function mapStateToProps(state) {
  const { alert, roles, rolesToPermissions, permissions, authorizations } = state
//  const { user } = authentication
  const authzn = authorizations[module]
  return {
    alert,
//    user,
    roles,
    rolesToPermissions,
    permissions,
    authzn
  }
}

const connectedLinkPage = connect(mapStateToProps)(RolesToPermissionsLinkPage)
export { connectedLinkPage as RolesToPermissionsLinkPage }

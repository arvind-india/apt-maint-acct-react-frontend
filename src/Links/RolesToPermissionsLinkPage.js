import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table, Alert, UncontrolledAlert } from 'reactstrap'
import { Router, Route } from 'react-router-dom'

import {
    Input,
    Label
} from 'reactstrap'

import {
  MdHome,
  MdAdd,
  MdVisibility,
  MdDelete,
  MdContentCut,
  MdAttachment,
  MdThumbUp,
  MdThumbDown
} from 'react-icons/lib/md' // material design icons

import {
  Button
} from 'reactstrap'

import { history } from '../_helpers'
import { PrivateRoute, FlashMessage } from '../_components'
import { roleActions,  permissionActions, alertActions } from '../_actions'


let url = '/rolesToPermissions'

class RolesToPermissionsLinkPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedOptionsInDList: []
    }
    this.handleChangeInLeftList = this.handleChangeInLeftList.bind(this)
    this.handleChangeInDetachedList = this.handleChangeInDetachedList.bind(this)
    this.attachItems = this.attachItems.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(roleActions.getAll())
    this.props.dispatch(permissionActions.getAll())
  }

  render() {
    console.log('Props in RolesToPermissionsLinkPage: ', this.props)
    const { alert } = this.props
    return (
      <div>
        <h3>Roles To Permissions Link</h3>
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
    const { roles } = this.props
    console.log('Roles: ', roles)
    return <div>
      <Label for="leftItem" className="llabel">Select a Role</Label>
      <Input
        type="select"
        name="leftItem"
        id="leftItem"
        size="20"
        className="lselect"
        onChange={this.handleChangeInLeftList}
      >
      { roles.items && roles.items.map(each =>
        <option value={each.id} title={each.description} key={each.id}
          >{each.name}</option>)
      }
      </Input>
      <Button color="link" className="homeButton"><Link to="/home"><MdHome/> Home</Link></Button>
    </div>
  }
  handleChangeInLeftList(event) {
    const { name, value } = event.target
    console.log('Left list name: ', name); console.log('Left list value: ', value)
    this.props.dispatch(roleActions.getMyPermissions(value))
  }
  showAttachedList() {
    const { rolesToPermissions } = this.props
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
        multiple
      >
      {
        rolesToPermissions.items && rolesToPermissions.items.map(each =>
        <option value={each.id} title={each.description} key={each.id}
          >{each.operations} on {each.resource} {each.condition?' (restricted)':''}</option>)
      }
      </Input>
      <Button type="submit" color="danger" className="dbutton"><MdThumbDown/> Revoke</Button>
    </div>
  }

  showDetachedList() {
    const { rolesToPermissions, permissions } = this.props
    console.log('Available permissions: ', permissions)
    let available = [];
    let grantedIDs = []
    if(rolesToPermissions.items) {
      grantedIDs = rolesToPermissions.items.map(each => each.id)
    }
    if(permissions.items) {
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
        disabled={this.state.selectedOptionsInDList.length==0}
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
    console.log('selected options: ', this.state.selectedOptionsInDList)
  }
}


function mapStateToProps(state) {
  const { authentication, alert, roles, rolesToPermissions, permissions } = state
  const { user } = authentication
  return {
    alert,
    user,
    roles,
    rolesToPermissions,
    permissions
  }
}

const connectedLinkPage = connect(mapStateToProps)(RolesToPermissionsLinkPage)
export { connectedLinkPage as RolesToPermissionsLinkPage }

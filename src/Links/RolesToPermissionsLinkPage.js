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
  MdAdd,
  MdVisibility,
  MdDelete
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
    // this.handleDeleteModel = this.handleDeleteModel.bind(this)
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
    return <div>
      <Label for="leftItem" className="llabel">Select a Role</Label>
      <Input type="select" name="leftItem" id="leftItem" size="20" className="lselect">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </Input>
    </div>
  }
  showAttachedList() {
    return <div>
      <Label for="attachedItems" className="alabel">Granted Permissions</Label>
      <Input type="select" name="attachedItems" id="attachedItems" size="20" multiple className="aselect">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </Input>
    </div>
  }
  showDetachedList() {
    return <div>
      <Label for="detachedItems" className="dlabel">Available Permissions</Label>
      <Input type="select" name="detachedItems" id="detachedItems" size="20" multiple className="dselect">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </Input>
    </div>
  }

}


function mapStateToProps(state) {
  const { authentication, alert, roles } = state
  const { user } = authentication
  return {
    alert,
    user,
    roles
  }
}

const connectedLinkPage = connect(mapStateToProps)(RolesToPermissionsLinkPage)
export { connectedLinkPage as RolesToPermissionsLinkPage }

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
import { flatActions,  residentActions } from '../_actions'

let module = 'flats-residents' // module name


class FlatsToResidentsLinkPage extends React.Component {

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
    this.props.dispatch(flatActions.getAll())
    this.props.dispatch(residentActions.getAll())
  }

  render() {
    const { alert } = this.props
    return (
      <div>
        <h3>Flats To Residents Link</h3>
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
    const { flats } = this.props
    return <div>
      <Label for="leftItem" className="llabel">Select a Flat</Label>
      <Input
        type="select"
        name="leftItem"
        id="leftItem"
        size="20"
        className="lselect"
        onChange={this.handleChangeInLeftList}
      >
      { flats.items && flats.items.map(each =>
        <option value={each.id} title={each.remark} key={each.id}
          >{each.block_number}-{each.flat_number}</option>)
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
    this.props.dispatch(flatActions.getMyResidents(value))
  }

  showAttachedList() {
    const { flatsToResidents, authzn } = this.props
    const { selectedOptionInLeftList, selectedOptionsInAList } = this.state
    return <div>
      <Label
        for="attachedItems"
        className="alabel"
      >Attached Residents</Label>
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
        flatsToResidents.items &&
        flatsToResidents.items.map(each =>
        <option value={each.id} title={each.remark?each.is_a+';'+each.remark:each.is_a} key={each.id}
          >{each.first_name} {each.last_name}</option>)
      }
      </Input>
      <Button
        color="danger"
        className="dbutton"
        onClick={this.detachItems}
        disabled={selectedOptionsInAList.length === 0}
        hidden={!authzn.allowsEdit}
        title="Detach selected items"
      ><MdThumbDown/> Detach</Button>
    </div>
  }
  handleChangeInAttachedList(event) {
    const { selectedOptions } = event.target
    this.setState({
      selectedOptionsInAList: Array.from(selectedOptions)
    })
  }
  detachItems() {
    const { dispatch, flatsToResidents } = this.props
    const { selectedOptionsInAList, selectedOptionInLeftList } = this.state

    let id = selectedOptionInLeftList
    let ids_toBeRemoved = selectedOptionsInAList.map(e => e.value)
    let ids = flatsToResidents.items.map(e => e.id.toString())
    let ids_toBeRetained = ids.filter(each => !ids_toBeRemoved.includes(each))

    dispatch(flatActions.updateMyResidents(id, ids_toBeRetained))
    this.setState({ selectedOptionsInAList: [] })
  }
  showDetachedList() {
    const { flatsToResidents, residents, authzn } = this.props
    const { selectedOptionInLeftList, selectedOptionsInDList } = this.state

    let available = [];
    let grantedIDs = []
    if(flatsToResidents.items) {
      grantedIDs = flatsToResidents.items.map(each => each.id)
    }
    if(residents.items && selectedOptionInLeftList) {
      available = grantedIDs.length ?
        residents.items.filter(each => !grantedIDs.includes(each.id)) :
        residents.items
    }
    return <div>
      <Label
        for="detachedItems"
        className="dlabel"
      >Available Residents</Label>
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
        <option value={each.id} title={each.remark?each.is_a+';'+each.remark:each.is_a} key={each.id}
          >{each.first_name} {each.last_name}</option>)
      }
      </Input>
      <Button
        color="success"
        className="abutton"
        onClick={this.attachItems}
        disabled={selectedOptionsInDList.length === 0}
        hidden={!authzn.allowsEdit}
        title="Attach selected items"
      ><MdThumbUp/> Attach</Button>
    </div>
  }

  handleChangeInDetachedList(event){
    const { selectedOptions } = event.target
    this.setState({
      selectedOptionsInDList: Array.from(selectedOptions)
    })
  }
  attachItems() {
    const { dispatch, flatsToResidents } = this.props
    const { selectedOptionsInDList, selectedOptionInLeftList } = this.state

    let id = selectedOptionInLeftList
    let ids = flatsToResidents.items.map(e => e.id)
    let ids_toBeAdded = selectedOptionsInDList.map(e => e.value)
    let new_ids = ids.concat(ids_toBeAdded)

    dispatch(flatActions.updateMyResidents(id, new_ids))
    this.setState({ selectedOptionsInDList: [] })
  }
}

function mapStateToProps(state) {
  const { alert, flats, flatsToResidents, residents, authorizations } = state
//  const { user } = authentication
  const authzn = authorizations[module]
  return {
    alert,
//    user,
    flats,
    flatsToResidents,
    residents,
    authzn
  }
}

const connectedLinkPage = connect(mapStateToProps)(FlatsToResidentsLinkPage)
export { connectedLinkPage as FlatsToResidentsLinkPage }

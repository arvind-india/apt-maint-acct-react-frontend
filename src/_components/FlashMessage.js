import React from 'react'
import { connect } from 'react-redux'
import { Alert, UncontrolledAlert } from 'reactstrap'

import { alertActions } from '../_actions'

class FlashMessage extends React.Component {
  constructor(props) {
    super(props)
    let delay = 3000  // milliseconds
    this.state = {
      visible: true
    }
    console.log('props', props)
    console.log('state', this.state)
    this.onDismiss = this.onDismiss.bind(this)
  }
  onDismiss() {
    console.log('onDismiss is called!')
    this.setState({ visible: false })
    this.timer = null
  }
  setTimer() {
    // clear any existing timer
    this.timer != null ? clearTimeout(this.timer) : null

    // hide after 'delay' milliseconds
    this.timer = setTimeout(this.onDismiss, 2000)
  }
  componentDidMount() {
    this.setTimer()
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

/*
<Alert
  color="info"
  isOpen={this.state.visible}
  toggle={this.onDismiss}
>Flash Alert Message: alert.message</Alert>

<Alert color="info" isOpen={visible} toggle={this.onDismiss}>{alert.message}</Alert>

*/

  render() {
    const { alert, visible } = this.props
    return (
      <div onClick={this.onDismiss}>
        <UncontrolledAlert color="info">Flash Alert Message: alert.message</UncontrolledAlert>
        <Alert color="info" isOpen={visible}>{alert.message}</Alert>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { alert, visible } = state
  return {
    alert,
    visible
  }
}

const connectedFlashMessage = connect(mapStateToProps)(FlashMessage)
export { connectedFlashMessage as FlashMessage }

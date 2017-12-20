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
    this.closeAlertMsg = this.closeAlertMsg.bind(this)
  }
  onDismiss() {
    console.log('onDismiss is called!')
    this.setState({ visible: false })
    this.timer = null
  }
  closeAlertMsg() {
    this.setState({ visible: false })
    this.timer = null
    console.log('closeAlertMsg is called!')
  }
  setTimer() {
    // clear any existing timer
    this.timer != null ? clearTimeout(this.timer) : null

    // hide after 'delay' milliseconds
    this.timer = setTimeout(this.onDismiss, 5000)
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
        <UncontrolledAlert color="info">Flash Alert Message: alert.message</UncontrolledAlert>

*/

  render() {
    const { alert } = this.props
    return (
      <div onClick={this.closeAlertMsg}>
        <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>{alert.message}</Alert>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { alert } = state
  return {
    alert
  }
}

const connectedFlashMessage = connect(mapStateToProps)(FlashMessage)
export { connectedFlashMessage as FlashMessage }

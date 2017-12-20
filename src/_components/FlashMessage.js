import React from 'react'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'

import { alertActions } from '../_actions'

/*
 * This class is intended to add Auto Closure of Alert message from reactstrap.
 * For that, it wraps <Alert...> component in a timer so as to hide the 'message'
 * after a 'delay' in milliseconds ( a default value of 1000 milliseconds is set)
 * Usage: <FlashMessage message={aString} delay={aNumber} />
 */
export class FlashMessage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }
    this.onDismiss = this.onDismiss.bind(this)
  }
  onDismiss() {
    this.setState({ visible: false })
    this.timer = null
  }
  setTimer() {
    // clear any existing timer
    this.timer != null ? clearTimeout(this.timer) : null

    // hide after 'delay' milliseconds
    this.timer = setTimeout(this.onDismiss, this.props.delay)
  }
  componentDidMount() {
    this.setTimer()
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    return (
      <div>
        <Alert
          color="info"
          isOpen={this.state.visible}
          toggle={this.onDismiss}
          >{this.props.message}</Alert>
      </div>
    )
  }
}

FlashMessage.defaultProps = {
  delay: 1000  // in milliseconds
}

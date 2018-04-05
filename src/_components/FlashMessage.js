import React from 'react'
import { Alert } from 'reactstrap'

/*
 * This class is intended to add Auto Closure of Alert message from reactstrap.
 * For that, it wraps <Alert...> component in a timer so as to hide the 'text'
 * after a 'delay' in milliseconds ( a default value of 1000 milliseconds is set)
 *
 * Usage: <FlashMessage text={aString} delay={aNumber} />
 *
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
    if(this.timer !== null) {
      clearTimeout(this.timer)
    }
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
          color={this.props.color}
          isOpen={this.state.visible}
          toggle={this.onDismiss}
          >{this.props.text}</Alert>
      </div>
    )
  }
}

FlashMessage.defaultProps = {
  delay: 1000  // in milliseconds
}

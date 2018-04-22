import React from 'react'


export class MonthlyAccount extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      paid: false
    }
  }

  render() {
    const { paid } = this.state
    return <div
        role="button"
        onClick={() => this.togglePaidStatus() }
      >{paid?'PAID':'UNPAID'}</div>
  }

  togglePaidStatus() {
    const { paid } = this.state
    this.setState({
      paid: !paid
    })
  }
}

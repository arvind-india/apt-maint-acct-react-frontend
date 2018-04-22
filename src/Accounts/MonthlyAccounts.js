import React from 'react'

import { default as MonthlyAccount } from './MonthlyAccount'

export class MonthlyAccounts extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      flatNumber: 'F1',
      forMonth: 4,
      forYear: 2018
    }
  }

  render() {
    return <MonthlyAccount {...this.state} />
  }

}

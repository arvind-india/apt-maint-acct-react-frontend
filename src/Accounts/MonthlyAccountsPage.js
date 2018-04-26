import React from 'react'
import { connect } from 'react-redux'

import { durationActions, flatActions } from '../_actions'
import { default as MonthlyAccount } from './MonthlyAccount'
import './MonthlyAccounts.css'

let module = 'accounts'

export class MonthlyAccounts extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      forMonth: 4,
      forYear: 2018
    }
  }
  componentDidMount() {
    this.props.getAllFlats()
  }
  render() {
    const { flats } = this.props
    return <div>
              <h3>Monthly Maintenance Fees Collection</h3>
              { flats && flats.items && this.showMonthlyAccounts() }
           </div>
  }

  showMonthlyAccounts(){
    const { flats, authzn } = this.props
    const { forMonth, forYear } = this.state
    return <ul className="grid">
      { flats.items.map((flat, index) => {
          return <li
            key={flat.id}
            className="box"
            role="button">
              <MonthlyAccount
                  flatNumber={flat.flat_number}
                  forMonth={forMonth}
                  forYear={forYear} />
          </li>
        })
      }
    </ul>
  }

} // end of class MonthlyAccounts

function mapStateToProps(state) {
  const { alert, authorizations, flats } = state
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  return {
    alert,
    authzn,
    flats,
    trackHistory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllFlats: () => {
      dispatch(flatActions.getAll())
    },
/*    getMonthlyAccountsFor: (data) => {
      dispatch(actions.getMonthlyListFor(data))
    }, */
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyAccounts)

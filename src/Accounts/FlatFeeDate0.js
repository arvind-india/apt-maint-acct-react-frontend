import React from 'react'
import {
  Button,
  Input
} from 'reactstrap'

export class FlatFeeDate extends React.Component {
    constructor(props) {
      super(props)
      let today = new Date()
      this.payNow = today.toISOString().substr(0,10)
      this.date = this.props.paidDate ? this.props.paidDate : this.payNow
      this.state = {
        editDate: false
      }
    }

    render() {
      const { editDate } = this.state
      return editDate ?
        this.showDateField() :
        this.showPaidDate()
    }

    showPaidDate() {
      return <div
          role="button"
          onClick={() => this.setState({editDate: true})}
        >{this.date}</div>
    }
    showDateField() {
      return <div>
        <Input
          id="paidDate"
          type="date"
          name="paidDate"
          value={this.date}
          className="paid-date"
          onChange={(event) => this.updatePaidDate(event)}
        />
        <Button
          size="sm"
          color="danger"
          title="Cancel"
          onClick={() => this.setState({editDate: false})}
        >x</Button>
      </div>
    }
    updatePaidDate(event) {
      const {name, value} = event.target
      console.log('name: '+name+', value: '+value)
      this.setState({ editDate: false })
      this.props.onDateChange(this.props.flatNumber, value)
    }
}

import React from 'react'

import {
  Button,
  Input,
  Label
} from 'reactstrap'

export class PaidDate extends React.Component {
  constructor(props) {
    super(props)
    let date = props.account ?
                props.account.recorded_at :
                new Date().toISOString().substr(0,10)
    this.state = {
      editDate: false,
      date: date
    }
    this.handleDateClick = this.handleDateClick.bind(this)
  }

  render() {
    const { editDate } = this.state
    return editDate ?
      this.showDateInput() :
      this.showDate()
  }

  showDate() {
    const { date } = this.state
    return <div
        className="paid-date"
        role="button"
        onClick={this.handleDateClick}
        style={this.getStyle()}
      >{date}</div>
  }
  getStyle() {
    const { authzn } = this.props
    return authzn && (authzn.allowsAdd || authzn.allowsEdit) ?
      { cursor: "pointer" } :
      { cursor: "default" }
  }
  handleDateClick() {
    const { authzn } = this.props
    if(!authzn) return;
    if(authzn.allowsAdd || authzn.allowsEdit) {
      this.setState({editDate: true})
    }
  }
  showDateInput() {
    const { date } = this.state
    return <div className="paid-date">
      <Input
        id="recordedAt"
        type="date"
        name="recorded_at"
        value={date}
        onChange={(event) => this.handleDateChange(event)}
      />
      <Button
        size="sm"
        color="danger"
        title="Cancel"
        onClick={() => this.setState({editDate: false})}
      >x</Button>
    </div>
  }
  handleDateChange(event) {
    const { name, value } = event.target
    const { account } = this.props
    this.setState({
      editDate: false,
      date: value
    },
    ()=>this.props.save(account, value))
  }

}

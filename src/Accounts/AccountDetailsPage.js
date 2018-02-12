import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select';

import {
    Form,
    Button,
    FormGroup,
    FormText,
    Input,
    Label,
} from 'reactstrap'

import { accountActions as actions,
         alertActions,
         flatActions
} from '../_actions'

import { CATEGORIES, MONTHS } from '../_constants'

let module = 'accounts' // module name

class AccountDetailsPage extends React.Component {

  constructor(props) {
    super(props)
    const { dispatch, match, location } = props
    let model = location.state.model // model supplied from list page
    let initializeModel = {
      id: model.id,
      recorded_at: model.recorded_at,
      item: model.item,
      flat_number: model.flat_number,
      name: model.name,
      for_month: model.for_month,
      for_year: model.for_year,
      crdr: model.crdr,
      amount: model.amount,
      balance: model.balance,
      category: model.category,
      remarks: model.remarks
    }
    this.state = {
      model: initializeModel,           // model to edit
      submitted: false,
      adding: match.params.id === "0"
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleFlatChange = this.handleFlatChange.bind(this)
    this.handleMonthChange = this.handleMonthChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    dispatch(flatActions.getAll())
    dispatch(alertActions.clear())  // clear alert messages from other pages
  }

  canBeSaved() { // check for changes in model, if changes present, it can save
    const { model } = this.state

    if (!model.recorded_at) return false
    if (!model.item) return false
    if (!model.name) return false
    if (!model.for_month) return false
    if (!model.for_year) return false
    if (!model.crdr) return false
    if (!model.amount) return false
    if (!model.category) return false
    if (!model.remarks) return false

    return true // can save changes
  }

  render() {
    const { alert } = this.props
    return (
      <div>
        <h2>Account Details</h2>
        { alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div> }
        { this.show() }
      </div>
    )
  }

  show(){
    const { adding } = this.state
    const { authzn } = this.props
    let title = adding?'Add':authzn.allowsEdit?'Edit':'View'
    return <Form onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>{title}</legend>
        <div data-row-span="2">
          {this.showRecordedAt()}
          {this.showItem()}
        </div>
        <div data-row-span="1">
          {this.showCategory()}
        </div>
        <div data-row-span="2">
          {this.showFlatNumber()}
          {this.showName()}
        </div>
        <div data-row-span="4">
          {this.showMonth()}
          {this.showYear()}
          {this.showAmount()}
          {this.showCrdr()}
        </div>
        <div data-row-span="1">
          {this.showRemarks()}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary" hidden={!authzn.allowsEdit}>Save</Button>
      <Button color="link"><Link to="/accounts">Cancel</Link></Button>
    </Form>
  }

  showRecordedAt() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Txn Date</Label>
        <Input
          type="date"
          name="recorded_at"
          value={model.recorded_at}
          placeholder="Transaction Date here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.recorded_at
          && <FormText color="danger">Transaction date is required</FormText>}
			</div>
  }

  handleChange(event) {
    const { name, value } = event.target
    const { model } = this.state
    this.setState({
        model: {
          ...model,
          [name]: value
        }
    })
  }

  showItem() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Item</Label>
        <Input
          type="text"
          name="item"
          value={model.item}
          placeholder="Item details here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.item
          && <FormText color="danger">Item is required</FormText>}
			</div>
  }

  handleSubmit(event) {
    const { model } = this.state
    const { dispatch } = this.props

    event.preventDefault()
    this.setState({ submitted: true })

    if ( this.changedProps().length === 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if(this.canBeSaved()){
      dispatch(actions.saveChanges(model))
    } else {
      dispatch(alertActions.error('Missing data'))
    }
  }

  changedProps() {
    const { model } = this.state
    const { location } = this.props
    let modelDB = location.state.model
    let props = []

    // check for changes in model props
    for(const prop in model) {
      if( prop === 'id') continue // exclude 'id' from comparision
      if(modelDB[prop] !== model[prop]) { // if data is changed wrt data in database
        props.push(prop)
      }
    }
    return props;
  }

  showCategory() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Category</Label>
        <Select
          name="form-field-name"
          value={model.category}
          multi={false}
          joinValues={false}
          simpleValue={true}
          placeholder="Select Category..."
          onChange={this.handleCategoryChange}
          valueKey="name"
          labelKey="name"
          options={CATEGORIES}
        />
        {submitted && !model.category
          && <FormText color="danger">Category is required</FormText>}
			</div>
  }

  handleCategoryChange(selectedOption) {
    const { model } = this.state
    this.setState({
      model: {
        ...model,
        category: selectedOption
      }
    })
  }

  showFlatNumber() {
    const { flats } = this.props
    const { model } = this.state
    let options = flats.items?flats.items:[]

    return <div data-field-span="1">
				<Label>Flat Number</Label>
        <Select
          name="form-field-name"
          value={model.flat_number}
          multi={false}
          joinValues={false}
          simpleValue={true}
          placeholder="Select a Flat Number..."
          onChange={this.handleFlatChange}
          valueKey="flat_number"
          labelKey="flat_number"
          options={options}
        />
			</div>
  }

  handleFlatChange(selectedOption) {
    const { model } = this.state
    this.setState({
      model: {
        ...model,
        flat_number: selectedOption
      }
    })
  }

  showName() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Name</Label>
        <Input
          type="text"
          name="name"
          value={model.name}
          placeholder="Name here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.name
          && <FormText color="danger">Name is required</FormText>}
			</div>
  }

  showMonth() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Month</Label>
        <Select
          name="form-field-name"
          value={model.for_month}
          multi={false}
          joinValues={false}
          simpleValue={true}
          placeholder="Select a Month..."
          onChange={this.handleMonthChange}
          valueKey="number"
          labelKey="name"
          options={MONTHS}
        />
        {submitted && !model.for_month
          && <FormText color="danger">Month is required</FormText>}
			</div>
  }
  handleMonthChange(selectedOption) {
    const { model } = this.state
    this.setState({
      model: {
        ...model,
        for_month: selectedOption
      }
    })
  }

  showYear() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Year</Label>
        <Input
          type="number"
          name="for_year"
          value={model.for_year}
          placeholder="Year here"
          className="inputField"
          min="2013"
          max="2030"
          onChange={this.handleChange}
        />
        {submitted && !model.for_year
          && <FormText color="danger">Year is required</FormText>}
			</div>
  }

  showAmount() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Amount</Label>
        <Input
          type="number"
          step="0.01"
          name="amount"
          value={model.amount}
          placeholder="Amount here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.amount
          && <FormText color="danger">Amount is required</FormText>}
			</div>
  }

  showCrdr() {
    const { model } = this.state
    let rtype = model && model.crdr?model.crdr:''

    return <div data-field-span="1">
        <Label>Collection/Expenditure</Label>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              name="crdr"
              value="cr"
              checked={rtype === "cr"}
              onChange={this.handleChange}
            /> Cr
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              name="crdr"
              value="dr"
              checked={rtype === "dr"}
              onChange={this.handleChange}
            /> Dr
          </Label>
        </FormGroup>
      </div>
  }

  showRemarks() {
    const { submitted, model } = this.state
    return <div data-field-span="1">
				<Label>Remarks</Label>
        <Input
          type="text"
          name="remarks"
          value={model.remarks}
          placeholder="Remarks here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.remarks
          && <FormText color="danger">Remarks is required</FormText>}
			</div>
  }

}

function mapStateToProps(state) {
  const { alert, authorizations, users, flats } = state
  const authzn = authorizations[module]
  return {
    alert,
    authzn,
    users,
    flats
  }
}

const connectedDetailsPage = connect(mapStateToProps)(AccountDetailsPage)
export { connectedDetailsPage as AccountDetailsPage }

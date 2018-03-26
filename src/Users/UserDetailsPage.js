import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Form,
    Button,
    FormGroup,
    FormText,
    Input,
    Label
} from 'reactstrap'

import { userActions as actions, alertActions } from '../_actions'

let module = 'users' // module name


export class UserDetails extends React.Component {

  constructor(props) {
    super(props)
    const { location } = props
    let model = location.state.model // model supplied from list page
    if(location.state.module) { module = location.state.module } // override if module is available, ex: user-profile
    let initializeModel = {
      id: model.id,
      name: model.name,
      first_name: model.first_name,
      last_name: model.last_name,
      email: model.email
    }
    let initializeInfos = this.arrToObj(model.infos)
    //let validationMsg = 'No changes to save'
    //let formValid = false

    this.state = {
      model: initializeModel,
      infos: initializeInfos,
      password: '',
      confirmPassword: '',
      passwordChanged: false,
      passwordMatches: false,
      submitted: false,
      touched: false,
      adding: model.id===0,
      title: location.state.title
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleInfosChange = this.handleInfosChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
    this.handlePasswordMatch = this.handlePasswordMatch.bind(this)
    this.handleConfirmPasswordMatch = this.handleConfirmPasswordMatch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    //dispatch(alertActions.clear())  // clear alert messages from other pages
    this.props.clearAlert() // clear alert messages from other pages
  }
  componentDidMount() {
    //const { dispatch, location, getById } = this.props
    //dispatch(actions.getById(location.state.model.id))
    this.props.getById(this.props.location.state.model.id)
  }
  changedProps() {
    const { model, infos } = this.state
    const { location } = this.props

    let modelDB = location.state.model
    let infosDB = location.state.model.infos
    let props = []
    // check for changes in model
    for(const prop in model) {
      if(modelDB[prop] !== model[prop]) { // if data is changed wrt data in database
        props.push(prop)
      }
    }
    // check for changes in infos
    for (const prop in infos) {
      if(infosDB[prop] && infosDB[prop] !== infos[prop]) {
        props.push(prop)
      }
    }
    return props
  }

  canBeSaved() { // check for changes in model, if changes present, it can save
    const { model } = this.state
    for(const prop in model) {
      if( prop === 'id') continue // skip 'id' from checking null or empty value
      if( !model[prop] ) {
        return false
      }
    }
    return true
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { model, infos } = this.state
    //const { model, infos, password, confirmPassword } = this.state
    //const { dispatch } = this.props

    let infosArray = this.objToArr(infos)

    if(infosArray.length > 0) model.infos = infosArray

    //console.log('User to be updated: ', model)
    this.props.saveChanges(model)
/*
    if ( this.changedProps().length === 0 ) {
      // dispatch(alertActions.error('No changes found...'))
      this.props.error('No changes found...')
    } else if (password !== confirmPassword) {
      // dispatch(alertActions.error('Passwords Do Not Match'))
      this.props.error('Passwords Do Not Match')
    } else if( this.canBeSaved() ) {
      //dispatch(actions.saveChanges(model))
      this.props.saveChanges(model)
    } else {
      //dispatch(alertActions.error('Missing Data...'))
      this.props.error('Missing Data...')
    }
  */

  }

  handlePasswordChange(event) {
    const { name, value } = event.target
    const { model } = this.state
    this.setState({
      [name]: value,
      passwordChanged: value ? true : false
    })
    if(value) { // if value exists, set it to model
      this.setState({
        model: {
          ...model,
          password: value
        }
      })
    }
  }
  handleConfirmPasswordChange(event) {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }
  handlePasswordMatch(event) {
    const { value } = event.target
    const { touched, confirmPassword } = this.state
    this.setState({
      passwordMatches: value && touched && value === confirmPassword
    })
  }
  handleConfirmPasswordMatch(event) {
    const { value } = event.target
    const { password } = this.state
    this.setState({
      touched: true,
      passwordMatches: value && value === password
    })
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
  handleInfosChange(event) {
    const { name, value } = event.target
    const { infos } = this.state
    console.log('handle infos change name: ', name); console.log('handle info change value: ', value)
    this.setState({
      infos: {
        ...infos,
        [name]: value ? value : null
      }
    })
  }

  render() {
    const { model, infos, title } = this.state
    const { alert } = this.props
    return (
      <div>
        <h2>{title}</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        {this.validateForm()}
        {this.show(model, infos)}
      </div>
    )
  }

  /**
   * Converts Array into object
   */
  arrToObj(array) {
    let obj = {}
    if(!array || array.length === 0) {
      return obj
    }
    array.forEach(eachInfo => {
      obj[eachInfo.key] = eachInfo.value
    })
    return obj
  }

  /**
   * Converts Object to Array
   */
   objToArr(obj) {
     let arr = []
     let val;
     Object.keys(obj).forEach(key => {
       val = obj[key]
       arr.push({key: key, value: val})
     })
     return arr
   }

  validateForm() {
    const { password, confirmPassword } = this.state
    //console.log('Form validations...')
    if ( this.changedProps().length === 0 ) {
      // dispatch(alertActions.error('No changes found...'))
      // this.props.error('No changes found...')
      this.validationMsg = 'No changes to save'
      this.formValid = false
    } else if (password !== confirmPassword) {
      // dispatch(alertActions.error('Passwords Do Not Match'))
      //this.props.error('Passwords Do Not Match')
      this.validationMsg = 'Password do not match'
      this.formValid = false
    } else if( this.canBeSaved() ) {
      //dispatch(actions.saveChanges(model))
      // this.props.saveChanges(model)
      this.validationMsg = 'Save Changes'
      this.formValid = true

    } else {
      //dispatch(alertActions.error('Missing Data...'))
      //this.props.error('Missing Data...')
      this.validationMsg = 'Missing "Required Data"...'
      this.formValid = false
    }

  }

  show(model, infos){
    const { adding } = this.state
    const { authzn } = this.props
    let title = adding?'Add':authzn.allowsEdit?'Edit':'View'
    return <Form id="userDetailsForm" onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>{title}</legend>
        <div data-row-span="1">
          {this.showUsername(model)}
        </div>
        <div data-row-span="2">
          {this.showFlatNumber(infos)}
          {this.showResidentType(infos)}
        </div>
        <div data-row-span="2">
          {this.showFirstName(model)}
          {this.showLastName(model)}
        </div>
        <div data-row-span="2">
          {this.showEmail(model)}
          {this.showPassword()}
        </div>
        <div data-row-span="2">
          {this.showOtherEmails(infos)}
          {this.showMobileNumbers(infos)}
        </div>
        <div data-row-span="2">
          {this.show2WheelerNumbers(infos)}
          {this.show4WheelerNumbers(infos)}
        </div>
        <div data-row-span="1">
          {this.showEmergencyContacts(infos)}
        </div>
      </fieldset>
      <br/>
      <Button
        type="submit"
        color="primary"
        disabled={!this.formValid}
        hidden={!authzn.allowsEdit}
        title={this.validationMsg}
        >Save</Button>
      <Button
        color="link"
        ><Link
          to="/users"
          className="text-danger"
          title="Go to Users"
          >Cancel</Link>
        </Button><br/>
    </Form>
  }

  showUsername(model) {
    const { submitted } = this.state // model is modified user
    return <div data-field-span="1">
				<Label>Username [Required]</Label>
        <Input
          id="userName"
          type="text"
          name="name"
          value={model.name}
          placeholder="User name here"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.name
        && <FormText color="danger">User Name is required</FormText>}
			</div>
  }
  showFlatNumber(infos) {
    // const { infos } = this.state
    let value = infos && infos.flatNumber?infos.flatNumber:''
    return <div data-field-span="1">
        <Label>Flat/Apartment Number</Label>
        <Input
          id="flatNumber"
          type="text"
          name="flatNumber"
          value={value}
          placeholder="Enter Flat Number if applicablee"
          className="inputField"
          onChange={this.handleInfosChange}
        />
      </div>
  }
  showResidentType(infos) {
    //const { infos } = this.state
    let rtype = infos && infos.residentType?infos.residentType:''

    return <div data-field-span="1">
        <Label>Resident Type</Label>
        <FormGroup check inline>
          <Label check>
            <Input
              className="residentType"
              type="radio"
              name="residentType"
              value="owner"
              checked={rtype === "owner"}
              onChange={this.handleInfosChange}
            /> Owner
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              className="residentType"
              type="radio"
              name="residentType"
              value="tenant"
              checked={rtype === "tenant"}
              onChange={this.handleInfosChange}
            /> Tenant
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              className="residentType"
              type="radio"
              name="residentType"
              value="NA"
              checked={rtype === "NA"}
              onChange={this.handleInfosChange}
            /> Not Applicable
          </Label>
        </FormGroup>
      </div>
  }
  showFirstName(model) {
    const { submitted } = this.state // mser is modified user
    return <div data-field-span="1">
        <Label>FirstName [Required]</Label>
        <Input
          id="firstName"
          type="text"
          name="first_name"
          value={model.first_name}
          placeholder="First name here"
          title="First Name of the user"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.first_name
        && <FormText color="danger">First Name is required</FormText>}
      </div>
  }
  showLastName(model) {
    const { submitted } = this.state // mser is modified user
    return <div data-field-span="1">
        <Label>LastName [Required]</Label>
        <Input
          id="lastName"
          type="text"
          name="last_name"
          value={model.last_name}
          placeholder="Last name here"
          title="Last name of the user"
          className="inputField"
          onChange={this.handleChange}
        />
          {submitted && !model.last_name
        && <FormText color="danger">Last Name is required</FormText>}
      </div>
  }
  showEmail(model){
    const { submitted } = this.state // mser is modified user
    return <div data-field-span="1">
        <Label>email [Required]</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={model.email}
          placeholder="<email id here>"
          title="eMail ID of the User"
          className="inputField"
          onChange={this.handleChange}
        />
        {submitted && !model.email
        && <FormText color="danger">Email-id is required</FormText>}
      </div>
  }
  showPassword(){
    const { touched, passwordMatches } = this.state
    return <div data-field-span="1">
      <Label>Password</Label>
      <Input
        id="password"
        type="password"
        name="password"
        placeholder="<enter password here>"
        title="Password is required"
        className="inputField"
        onChange={this.handlePasswordChange}
        onBlur={this.handlePasswordMatch}
      />
      {this.state.passwordChanged &&
        <div data-field-span="1">
          <Label>Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="<repeat password here>"
            title="Confirm Password is required"
            className="inputField"
            onChange={this.handleConfirmPasswordChange}
            onBlur={this.handleConfirmPasswordMatch}
          />
          {touched && !passwordMatches && <FormText color="danger">Password do NOT match</FormText>}
        </div>
      }
    </div>
  }
  showOtherEmails(infos){
    //const { infos } = this.state
    let value = infos && infos.otherEmails?infos.otherEmails:''
    return <div data-field-span="1">
        <Label>Other email-ids</Label>
        <Input
          id="otherEmails"
          type="textarea"
          name="otherEmails"
          value={value}
          placeholder="example1@email.id, example2@email.id"
          title="Other eMail IDs of the User"
          className="inputField"
          onChange={this.handleInfosChange}
          rows="2"
        />
      </div>
  }
  showMobileNumbers(infos) {
    //const { infos } = this.state
    let value = infos && infos.cellNumbers?infos.cellNumbers:''
    return <div data-field-span="1">
      <Label>Cell/Mobile/Landline Numbers</Label>
      <Input
        id="cellNumbers"
        type="textarea"
        name="cellNumbers"
        value={value}
        placeholder="eg: 9797097970, 044-27273030"
        title="Mobile or Landline Phone numbers of the User"
        className="inputField"
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  show2WheelerNumbers(infos) {
    //const { infos } = this.state
    let value = infos && infos.twoWheelers?infos.twoWheelers:''
    return <div data-field-span="1">
      <Label>Regn No. of 2-wheeler(s) parked</Label>
      <Input
        id="twoWheelers"
        type="textarea"
        name="twoWheelers"
        value={value}
        placeholder="eg: TN 11 CY 1234, TN 01 AZ 9876"
        title="Registration Number of Two Wheelers parked by the User"
        className="inputField"
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  show4WheelerNumbers(infos) {
    //const { infos } = this.state
    let value = infos && infos.fourWheelers?infos.fourWheelers:''
    return <div data-field-span="1">
      <Label>Regn No. of 4-wheeler(s) parked</Label>
      <Input
        id="fourWheelers"
        type="textarea"
        name="fourWheelers"
        value={value}
        placeholder="eg: TN 22 A 4567, TN 02 BD 789"
        title="Registration Number of Four Wheelers parked by the User"
        className="inputField"
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  showEmergencyContacts(infos) {
    //const { infos } = this.state
    let value = infos && infos.emergencyContacts?infos.emergencyContacts:''
    return <div data-field-span="1">
      <Label>Emergency Contact Details</Label>
      <Input
        id="emergencyContacts"
        type="textarea"
        name="emergencyContacts"
        value={value}
        placeholder="In case of emergency, whom to approach (such as relatives, friends), enter their name, address, or phone numbers here"
        title="Contact phone numbers in case of emergencies"
        className="inputField"
        onChange={this.handleInfosChange}
        rows="1"
      />
    </div>
  }

}

function mapStateToProps(state) {
  const { alert, authorizations } = state
//  const { user } = authentication
  const authzn = authorizations[module]
  return {
//    user,
//    userDetails,
    alert,
    authzn
  }
}

function mapDispatchToProps(dispatch) {
  return {
    clearAlert: () => {
      dispatch(alertActions.clear())
    },
    getById: (id) => {
      dispatch(actions.getById(id))
    },
    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    },
    error: (msg) => {
      dispatch(alertActions.error(msg))
    }
  }
}


//const connectedDetailsPage = connect(mapStateToProps)(UserDetailsPage)
//export { connectedDetailsPage as UserDetailsPage }

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails)

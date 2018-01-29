import React from 'react'
//import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Form,
    Button,
    FormGroup,
    FormText,
    Input,
    Label,
//    Col,
//    FormFeedback
} from 'reactstrap'

import { userActions as actions, alertActions } from '../_actions'

let module = 'users' // module name


class UserDetailsPage extends React.Component {

  constructor(props) {
    super(props)
    const { dispatch, match, location } = props
    let model = location.state.model // model supplied from list page
    console.log('user model: ', model)
    let initializeModel = {
      id: model.id,
      name: model.name,
      first_name: model.first_name,
      last_name: model.last_name,
      email: model.email
    }
    let initializeInfos = this.arrToObj(model.infos)
    this.state = {
      model: initializeModel,
      infos: initializeInfos,
      mModel: {},
      mInfos: {},
      mResidentType: null,
      password: '',
      confirmPassword: '',
      passwordChanged: false,
      passwordMatches: false,
      submitted: false,
      touched: false,
      adding: match.params.id==="0"
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleInfosChange = this.handleInfosChange.bind(this)
    //this.handleResidentTypeChange = this.handleResidentTypeChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
    this.handlePasswordMatch = this.handlePasswordMatch.bind(this)
    this.handleConfirmPasswordMatch = this.handleConfirmPasswordMatch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    dispatch(alertActions.clear())  // clear alert messages from other pages
  }
  componentDidMount() {
    this.props.dispatch(actions.getById(this.props.match.params.id))
  }
  changedProps() {
    const { model, infos } = this.state
    const { location } = this.props
    //const { userDetails } = this.props
    //let modelDB = userDetails.data
    let modelDB = location.state.model
    //let infosDB = this.arrToObj(modelDB.infos)
    let infosDB = location.state.model.infos
    let props = []
    // check for changes in mModel
    for(const prop in model) {
      if(modelDB[prop] !== model[prop]) { // if data is changed wrt data in database
        props.push(prop)
      }
    }
    // check for changes in mInfos
    for (const prop in infos) {
      if(infosDB[prop] && infosDB[prop] !== infos[prop]) {
        props.push(prop)
      }
    }
    // check for changes in mResidentType
    //let prop = 'residentType'
    //if(mResidentType && infosDB[prop] && infosDB[prop] !== mResidentType) {
    //  props.push('residentType')
    //}
    return props
  }

/*
changedProps() {
  const { mModel, mInfos, mResidentType } = this.state
  const { userDetails } = this.props
  let modelDB = userDetails.data
  let infosDB = this.arrToObj(modelDB.infos)
  let props = []
  // check for changes in mModel
  for(const prop in mModel) {
    if(modelDB[prop] !== mModel[prop]) { // if data is changed wrt data in database
      props.push(prop)
    } else {
      delete mModel[prop]  // remove unchanged property
    }
  }
  // check for changes in mInfos
  for (const prop in mInfos) {
    if(infosDB[prop] && infosDB[prop] !== mInfos[prop]) {
      props.push(prop)
    } else {
      delete mInfos[props]
    }
  }
  // check for changes in mResidentType
  let prop = 'residentType'
  if(mResidentType && infosDB[prop] && infosDB[prop] !== mResidentType) {
    props.push('residentType')
  }
  return props
}


  canSave() { // check for changes in mModel, if changes present, it can save
    const { mModel } = this.state
    for(const prop in mModel) {
      if( !mModel[prop] ) {
        return false
      }
    }
    return true
  } */
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

/*
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { model, infos, mModel, mInfos, mResidentType, password, confirmPassword, adding } = this.state
    const { dispatch, userDetails } = this.props

    let modelDB = userDetails.data
    let canSave = this.canSave()
    let cProps = this.changedProps()
    if(adding) {
      modelDB.id = 0
    }
    if(canSave) {
      mModel.id = modelDB.id
    }
    if( !cProps.includes('email') ) {
      mModel.email = modelDB.email
    }
    // check for changes in mInfos and include those changes after conversion into an array
    let mInfosArray = this.objToArr(mInfos)

    if(mInfosArray.length > 0) {
      mModel.infos = mInfosArray
    }
    if(mResidentType){
      if(adding || modelDB.infos.residentType !== mResidentType) {
        if(!mModel.infos) {
          mModel.infos = []
        }
        mModel.infos.push({key: 'residentType', value: mResidentType})
      }
    }
    console.log('User to be updated: ', mModel)
    if ( cProps.length === 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if (password !== confirmPassword) {
      dispatch(alertActions.error('Passwords Do Not Match'))
    } else if (canSave) {
      dispatch(actions.saveChanges(mModel))
    } else {
      dispatch(alertActions.error('Missing Data...'))
    }
  } */

  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { model, infos, password, confirmPassword } = this.state
    const { dispatch, userDetails } = this.props

    // let modelDB = userDetails.data
    // let canSave = this.canSave()
    // let cProps = this.changedProps()
    // if(adding) {
    //  modelDB.id = 0
    // }
    // if(canSave) {
    //  mModel.id = modelDB.id
    // }
    // if( !cProps.includes('email') ) {
    //  mModel.email = modelDB.email
    // }
    // check for changes in mInfos and include those changes after conversion into an array
    //let mInfosArray = this.objToArr(mInfos)
    let infosArray = this.objToArr(infos)
/*
    if(mInfosArray.length > 0) {
      mModel.infos = mInfosArray
    } */

    if(infosArray.length > 0) model.infos = infosArray

    /*
    if(mResidentType){
      if(adding || modelDB.infos.residentType !== mResidentType) {
        if(!mModel.infos) {
          mModel.infos = []
        }
        mModel.infos.push({key: 'residentType', value: mResidentType})
      }
    } */
    console.log('User to be updated: ', model)
    if ( this.changedProps().length === 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if (password !== confirmPassword) {
      dispatch(alertActions.error('Passwords Do Not Match'))
    } else if( this.canBeSaved() ) {
      dispatch(actions.saveChanges(model))
    } else {
      dispatch(alertActions.error('Missing Data...'))
    }
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
/*  handleResidentTypeChange(event) {
    const { value } = event.target
    this.setState({
      mResidentType: value
    })
  } */
  render() {
    const { userDetails, alert } = this.props
    return (
      <div>
        <h2>User Details</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        {userDetails.loading && <em>Loading user details...}</em>}
        {userDetails.error && <span className="text-danger">{userDetails.error}</span>}
        {userDetails.data && this.show(userDetails.data)}
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

  show(data){
    const { adding } = this.state
    const { authzn } = this.props
    let title = adding?'Add':authzn.allowsEdit?'Edit':'View'
    let infosObj = this.arrToObj(data.infos)
    return <Form onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>{title}</legend>
        <div data-row-span="1">
          {this.showUsername(data)}
        </div>
        <div data-row-span="2">
          {this.showFlatNumber(infosObj)}
          {this.showResidentType(infosObj)}
        </div>
        <div data-row-span="2">
          {this.showFirstName(data)}
          {this.showLastName(data)}
        </div>
        <div data-row-span="2">
          {this.showEmail(data)}
          {this.showPassword()}
        </div>
        <div data-row-span="2">
          {this.showOtherEmails(infosObj)}
          {this.showMobileNumbers(infosObj)}
        </div>
        <div data-row-span="2">
          {this.show2WheelerNumbers(infosObj)}
          {this.show4WheelerNumbers(infosObj)}
        </div>
        <div data-row-span="1">
          {this.showEmergencyContacts(infosObj)}
        </div>
      </fieldset>
      <br/>
      <Button type="submit" color="primary" hidden={!authzn.allowsEdit}>Save</Button>
      <Button color="link"><Link to="/users">Cancel</Link></Button>
    </Form>
  }

  showUsername(data) {
    const { submitted, model } = this.state // mModel is modified user
    return <div data-field-span="1">
				<Label>Username</Label>
        <Input
          type="text"
          name="name"
          value={model.name}
          placeholder="User name here"
          className="inputField"
//          defaultValue={data.name}
          onChange={this.handleChange}
        />
        {submitted && !model.name
//        {submitted && mModel.name !== null && mModel.name === ""
        && <FormText color="danger">User Name is required</FormText>}
			</div>
  }
  showFlatNumber(infos0) {
    const { model, infos } = this.state
    // const { infos } = model
    let value = infos && infos.flatNumber?infos.flatNumber:''
    return <div data-field-span="1">
        <Label>Flat/Apartment Number</Label>
        <Input
          type="text"
          name="flatNumber"
          value={value}
          placeholder="Enter Flat Number if applicablee"
          className="inputField"
//          defaultValue={infos.flatNumber}
          onChange={this.handleInfosChange}
        />
      </div>
  }
  showResidentType(infos0) {
    const { mResidentType, model, infos } = this.state
    //const { infos } = model
    let rtype = infos && infos.residentType?infos.residentType:''
    //let rtype = mResidentType ? mResidentType : infos.residentType
    //let rtype = model.infos.residentType
    return <div data-field-span="1">
        <Label>Resident Type</Label>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              name="residentType"
              value="owner"
              checked={rtype === "owner"}
//              onChange={this.handleResidentTypeChange}
              onChange={this.handleInfosChange}
            /> Owner
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
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
  showFirstName(data) {
    const { submitted, model } = this.state // mser is modified user
    return <div data-field-span="1">
        <Label>FirstName</Label>
        <Input
          type="text"
          name="first_name"
          value={model.first_name}
          placeholder="First name here"
          title="First Name of the user"
          className="inputField"
//          defaultValue={data.first_name}
          onChange={this.handleChange}
        />
        {submitted && !model.first_name
//        {submitted && mModel.first_name != null && mModel.first_name === ""
        && <FormText color="danger">First Name is required</FormText>}
      </div>
  }
  showLastName(data) {
    const { submitted, model } = this.state // mser is modified user
    return <div data-field-span="1">
        <Label>LastName</Label>
        <Input
          type="text"
          name="last_name"
          value={model.last_name}
          placeholder="Last name here"
          title="Last name of the user"
          className="inputField"
//          defaultValue={data.last_name}
          onChange={this.handleChange}
        />
          {submitted && !model.last_name
//        {submitted && mModel.last_name != null && mModel.last_name === ""
        && <FormText color="danger">Last Name is required</FormText>}
      </div>
  }
  showEmail(data){
    const { submitted, model } = this.state // mser is modified user
    return <div data-field-span="1">
        <Label>email</Label>
        <Input
          type="email"
          name="email"
          value={model.email}
          placeholder="<email id here>"
          title="eMail ID of the User"
          className="inputField"
//          defaultValue={data.email}
          onChange={this.handleChange}
        />
        {submitted && !model.email
//        {submitted && mModel.email != null && mModel.email === ""
        && <FormText color="danger">Email-id is required</FormText>}
      </div>
  }
  showPassword(){
    const { touched, passwordMatches } = this.state
    return <div data-field-span="1">
      <Label>Password</Label>
      <Input
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
  showOtherEmails(infos0){
    const { model, infos } = this.state
    //const { infos} = model
    let value = infos && infos.otherEmails?infos.otherEmails:''
    return <div data-field-span="1">
        <Label>Other email-ids</Label>
        <Input
          type="textarea"
          name="otherEmails"
          value={value}
          placeholder="example1@email.id, example2@email.id"
          title="Other eMail IDs of the User"
          className="inputField"
//          defaultValue={infos.otherEmails}
          onChange={this.handleInfosChange}
          rows="2"
        />
      </div>
  }
  showMobileNumbers(infos0) {
    const { model, infos } = this.state
    //const { infos } = model
    let value = infos && infos.cellNumbers?infos.cellNumbers:''
    return <div data-field-span="1">
      <Label>Cell/Mobile/Landline Numbers</Label>
      <Input
        type="textarea"
        name="cellNumbers"
        value={value}
        placeholder="eg: 9797097970, 044-27273030"
        title="Mobile or Landline Phone numbers of the User"
        className="inputField"
//        defaultValue={infos.cellNumbers}
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  show2WheelerNumbers(infos0) {
    const { model, infos } = this.state
    //const { infos } = model
    let value = infos && infos.twoWheelers?infos.twoWheelers:''
    return <div data-field-span="1">
      <Label>Regn No. of 2-wheeler(s) parked</Label>
      <Input
        type="textarea"
        name="twoWheelers"
        value={value}
        placeholder="eg: TN 11 CY 1234, TN 01 AZ 9876"
        title="Registration Number of Two Wheelers parked by the User"
        className="inputField"
//        defaultValue={infos.twoWheelers}
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  show4WheelerNumbers(infos0) {
    const { model, infos } = this.state
    //const { infos } = model
    let value = infos && infos.fourWheelers?infos.fourWheelers:''
    return <div data-field-span="1">
      <Label>Regn No. of 4-wheeler(s) parked</Label>
      <Input
        type="textarea"
        name="fourWheelers"
        value={value}
        placeholder="eg: TN 22 A 4567, TN 02 BD 789"
        title="Registration Number of Four Wheelers parked by the User"
        className="inputField"
//        defaultValue={infos.fourWheelers}
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  showEmergencyContacts(infos0) {
    const { model, infos } = this.state
    //const { infos } = model
    let value = infos && infos.emergencyContacts?infos.emergencyContacts:''
    return <div data-field-span="1">
      <Label>Emergency Contact Details</Label>
      <Input
        type="textarea"
        name="emergencyContacts"
        value={value}
        placeholder="In case of emergency, whom to approach (such as relatives, friends), enter their name, address, or phone numbers here"
        title="Contact phone numbers in case of emergencies"
        className="inputField"
//        defaultValue={infos.emergencyContacts}
        onChange={this.handleInfosChange}
        rows="1"
      />
    </div>
  }

}

function mapStateToProps(state) {
  const { userDetails, alert, authorizations } = state
//  const { user } = authentication
  const authzn = authorizations[module]
  return {
//    user,
    userDetails,
    alert,
    authzn
  }
}

const connectedDetailsPage = connect(mapStateToProps)(UserDetailsPage)
export { connectedDetailsPage as UserDetailsPage }

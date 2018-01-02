import React from 'react'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Form,
    Button,
    FormGroup,
    FormText,
    Input,
    Label,
    Col,
    FormFeedback
} from 'reactstrap'

import { userActions, alertActions } from '../_actions'


class UserDetailsPage extends React.Component {

  constructor(props) {

    super(props)

    const { dispatch, userDetails } = props

    this.state = {
      mUser: {},
      mInfos: {},
      mResidentType: null,
      password: '',
      confirmPassword: '',
      passwordChanged: false,
      passwordMatches: false,
      submitted: false,
      touched: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleInfosChange = this.handleInfosChange.bind(this)
    this.handleResidentTypeChange = this.handleResidentTypeChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
    this.handlePasswordMatch = this.handlePasswordMatch.bind(this)
    this.handleConfirmPasswordMatch = this.handleConfirmPasswordMatch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    dispatch(alertActions.clear())  // clear alert messages from other pages
  }
  componentDidMount() {
    this.props.dispatch(userActions.getById(this.props.match.params.id))
  }
  changedProps() {
    const { mUser, mInfos, mResidentType } = this.state
    const { userDetails } = this.props
    let userDB = userDetails.data
    let infosDB = this.arrToObj(userDB.infos)
    let props = []
    // check for changes in mUser
    for(const prop in mUser) {
      if(userDB[prop] != mUser[prop]) { // if data is changed wrt data in database
        props.push(prop)
      } else {
        delete mUser[prop]  // remove unchanged property
      }
    }
    // check for changes in mInfos
    for (const prop in mInfos) {
      if(infosDB[prop] && infosDB[prop] != mInfos[prop]) {
        props.push(prop)
      } else {
        delete mInfos[props]
      }
    }
    // check for changes in mResidentType
    let prop = 'residentType'
    if(mResidentType && infosDB[prop] && infosDB[prop] != mResidentType) {
      props.push('residentType')
    }
    return props
  }
  canSave() { // check for changes in mUser, if changes present, it can save
    const { mUser } = this.state
    for(const prop in mUser) {
      if( !mUser[prop] ) {
        return false
      }
    }
    return true
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { mUser, mInfos, mResidentType, submitted, password, confirmPassword } = this.state
    const { dispatch, userDetails } = this.props
    let userDB = userDetails.data
    let canSave = this.canSave()
    let cProps = this.changedProps()

    if(canSave) {
      mUser.id = userDB.id
    }
    if( !cProps.includes('email') ) {
      mUser.email = userDB.email
    }
    // check for changes in mInfos and include those changes after conversion into an array
    let mInfosArray = this.objToArr(mInfos)

    if(mInfosArray.length > 0) {
      mUser.infos = mInfosArray
    }
    if(mResidentType && userDB.infos.residentType != mResidentType) {
      if(!mUser.infos) {
        mUser.infos = []
      }
      mUser.infos.push({key: 'residentType', value: mResidentType})
    }
    console.log('User to be updated: ', mUser)
    if ( cProps.length == 0 ) {
      dispatch(alertActions.error('No changes found...'))
    } else if (password != confirmPassword) {
      dispatch(alertActions.error('Passwords Do Not Match'))
    } else if (canSave) {
      dispatch(userActions.saveChanges(mUser))
    } else {
      dispatch(alertActions.error('Missing Data...'))
    }
  }
  handlePasswordChange(event) {
    const { name, value } = event.target
    const { mUser } = this.state
    this.setState({
      [name]: value,
      passwordChanged: value ? true : false
    })
    if(value) { // if value exists, set it to mUser
      this.setState({
        mUser: {
          ...mUser,
          password: value
        }
      })
    } else { // remove password prop from mUser
      delete mUser.password
    }
  }
  handleConfirmPasswordChange(event) {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }
  handlePasswordMatch(event) {
    const { name, value } = event.target
    const { touched, confirmPassword } = this.state
    this.setState({
      passwordMatches: value && touched && value === confirmPassword
    })
  }
  handleConfirmPasswordMatch(event) {
    const { name, value } = event.target
    const { password } = this.state
    this.setState({
      touched: true,
      passwordMatches: value && value === password
    })
  }
  handleChange(event) {
    const { name, value } = event.target
    const { mUser } = this.state
    this.setState({
      mUser: {
        ...mUser,
        [name]: value
      }
    })
  }
  handleInfosChange(event) {
    const { name, value } = event.target
    const { mInfos } = this.state
    this.setState({
      mInfos: {
        ...mInfos,
        [name]: value ? value : null
      }
    })
  }
  handleResidentTypeChange(event) {
    const { name, value } = event.target
    this.setState({
      mResidentType: value
    })
  }
  render() {
    const { userDetails, user, match, alert, submitted } = this.props
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
    if(!array || array.length == 0) {
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
    let infosObj = this.arrToObj(data.infos)

    return <Form onSubmit={this.handleSubmit} className="grid-form">
      <fieldset>
  			<legend>View or Edit</legend>
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
      <Button type="submit" color="primary">Save</Button>
      <Button color="link"><Link to="/users">Cancel</Link></Button>
    </Form>
  }

  showUsername(data) {
    const { submitted, mUser } = this.state // mUser is modified user
    return <div data-field-span="1">
				<Label>Username</Label>
        <Input
          type="text"
          name="name"
          placeholder="User name here"
          className="inputField"
          defaultValue={data.name}
          onChange={this.handleChange}
        />
        {submitted && mUser.name != null && mUser.name == ""
        && <FormText color="danger">User Name is required</FormText>}
			</div>
  }
  showFlatNumber(infos) {
    return <div data-field-span="1">
        <Label>Flat/Apartment Number</Label>
        <Input
          type="text"
          name="flatNumber"
          placeholder="Enter Flat Number if applicablee"
          className="inputField"
          defaultValue={infos.flatNumber}
          onChange={this.handleInfosChange}
        />
      </div>
  }
  showResidentType(infos) {
    const { mResidentType } = this.state
    let rtype = mResidentType ? mResidentType : infos.residentType
    return <div data-field-span="1">
        <Label>Resident Type</Label>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              name="residentType"
              value="owner"
              checked={rtype === "owner"}
              onChange={this.handleResidentTypeChange}
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
              onChange={this.handleResidentTypeChange}
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
              onChange={this.handleResidentTypeChange}
            /> Not Applicable
          </Label>
        </FormGroup>
      </div>
  }
  showFirstName(data) {
    const { submitted, mUser } = this.state // mser is modified user
    return <div data-field-span="1">
        <Label>FirstName</Label>
        <Input
          type="text"
          name="first_name"
          placeholder="First name here"
          title="First Name of the user"
          className="inputField"
          defaultValue={data.first_name}
          onChange={this.handleChange}
        />
        {submitted && mUser.first_name != null && mUser.first_name === ""
        && <FormText color="danger">First Name is required</FormText>}
      </div>
  }
  showLastName(data) {
    const { submitted, mUser } = this.state // mser is modified user
    return <div data-field-span="1">
        <Label>LastName</Label>
        <Input
          type="text"
          name="last_name"
          placeholder="Last name here"
          title="Last name of the user"
          className="inputField"
          defaultValue={data.last_name}
          onChange={this.handleChange}
        />
        {submitted && mUser.last_name != null && mUser.last_name === ""
        && <FormText color="danger">Last Name is required</FormText>}
      </div>
  }
  showEmail(data){
    const { submitted, mUser } = this.state // mser is modified user
    return <div data-field-span="1">
        <Label>email</Label>
        <Input
          type="email"
          name="email"
          placeholder="<email id here>"
          title="eMail ID of the User"
          className="inputField"
          defaultValue={data.email}
          onChange={this.handleChange}
        />
        {submitted && mUser.email != null && mUser.email === ""
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
  showOtherEmails(infos){
    return <div data-field-span="1">
        <Label>Other email-ids</Label>
        <Input
          type="textarea"
          name="otherEmails"
          placeholder="example1@email.id, example2@email.id"
          title="Other eMail IDs of the User"
          className="inputField"
          defaultValue={infos.otherEmails}
          onChange={this.handleInfosChange}
          rows="2"
        />
      </div>
  }
  showMobileNumbers(infos) {
    return <div data-field-span="1">
      <Label>Cell/Mobile/Landline Numbers</Label>
      <Input
        type="textarea"
        name="cellNumbers"
        placeholder="eg: 9797097970, 044-27273030"
        title="Mobile or Landline Phone numbers of the User"
        className="inputField"
        defaultValue={infos.cellNumbers}
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  show2WheelerNumbers(infos) {
    return <div data-field-span="1">
      <Label>Regn No. of 2-wheeler(s) parked</Label>
      <Input
        type="textarea"
        name="twoWheelers"
        placeholder="eg: TN 11 CY 1234, TN 01 AZ 9876"
        title="Registration Number of Two Wheelers parked by the User"
        className="inputField"
        defaultValue={infos.twoWheelers}
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  show4WheelerNumbers(infos) {
    return <div data-field-span="1">
      <Label>Regn No. of 4-wheeler(s) parked</Label>
      <Input
        type="textarea"
        name="fourWheelers"
        placeholder="eg: TN 22 A 4567, TN 02 BD 789"
        title="Registration Number of Four Wheelers parked by the User"
        className="inputField"
        defaultValue={infos.fourWheelers}
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  showEmergencyContacts(infos) {
    return <div data-field-span="1">
      <Label>Emergency Contact Details</Label>
      <Input
        type="textarea"
        name="emergencyContacts"
        placeholder="In case of emergency, whom to approach (such as relatives, friends), enter their name, address, or phone numbers here"
        title="Contact phone numbers in case of emergencies"
        className="inputField"
        defaultValue={infos.emergencyContacts}
        onChange={this.handleInfosChange}
        rows="1"
      />
    </div>
  }

}

function mapStateToProps(state) {
  const { userDetails, authentication, alert } = state
  const { user } = authentication
  return {
    user,
    userDetails,
    alert
  }
}

const connectedDetailsPage = connect(mapStateToProps)(UserDetailsPage)
export { connectedDetailsPage as UserDetailsPage }

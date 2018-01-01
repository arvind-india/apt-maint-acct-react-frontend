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
          Col
} from 'reactstrap'

import { userActions, alertActions } from '../_actions'

class UserDetailsPage extends React.Component {
  constructor(props) {
    super(props)
    const { dispatch, userDetails } = props
    let infosDB = userDetails.data ? this.arrToObj(userDetails.data.infos) : {}
    this.state = {
      mUser: {
        infos: infosDB
      },
      password: '',
      confirmPassword: '',
      submitted: false,
      passwordChanged: false,
      passwordMatches: false,
      mInfos: {}
    //  mInfos: infosDB  // copy of infos for modification
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleInfosChange = this.handleInfosChange.bind(this)
    this.handlePasswordChange= this.handlePasswordChange.bind(this)
    this.handleConfirmPasswordChange= this.handleConfirmPasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    dispatch(alertActions.clear())  // clear alert messages from other pages
  }
  componentDidMount() {
    this.props.dispatch(userActions.getById(this.props.match.params.id))
  }
  hasChanges(mUser) {
    for(const prop in mUser){
      return true
    }
    return false
  }
  changedProps() {
    const { mUser } = this.state
    let props = []
    for(const prop in mUser) {
      props.push(prop)
    }
    return props
  }
  canSave() { // check for changes in mUser, if present, it can save
    const { mUser } = this.state
    for(const prop in mUser) {
        if( !mUser[prop] ) return false
    }
    return true
  }
  handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })

    const { mUser, mInfos, submitted, confirmPassword } = this.state
    const { dispatch, userDetails } = this.props

    let canSave = this.canSave()
    let cProps = this.changedProps()
    let hasChanges = cProps.length > 0
    let hasEmailChange = cProps.includes('email')

    if(canSave) {
      mUser.id = userDetails.data.id
    }
    if(!hasEmailChange) {
      mUser.email = userDetails.data.email
    }
/*    if(mInfos) {
      console.log('Modified mInfos: ', mInfos)
      let arr = this.objToArr(mInfos)
      console.log('Info Array to be saved: ', arr)
      this.setState({
        mUser: {
          ...mUser,
          infos: arr
        }
      })
      if(!hasChanges) hasChanges = true
    } */
    console.log('User to be updated: ', mUser)
    if (!hasChanges) {
      dispatch(alertActions.error('No changes found...'))
    } else if (canSave) {
      dispatch(userActions.saveChanges(mUser))
    } else {
      dispatch(alertActions.error('Missing Data...'))
    }
  }
  handlePasswordChange(event) {
    const { name, value } = event.target
    this.setState({ [name]: value  })
    if(value) {
      this.setState({ passwordChanged: true })
    } else {
      this.setState({ passwordChanged: false})
    }
  }
  handleConfirmPasswordChange(event) {
    const { name, value } = event.target
    this.setState({ [name]: value })

    if(value && value === this.state.password) {
      this.setState({ passwordMatches: true })
    } else {
      this.setState({ passwordMatches: false })
    }

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
    const { mInfos, mUser } = this.state
    let val = value ? value : null
 console.log('Name: ', name); console.log('Value: ', val);
    this.setState({
      mUser: {
        ...mUser,
        infos: {
          ...mUser.infos,
          [name]: val
        }
      }
    });
  }
  render() {
    const { userDetails, user, match, alert, submitted } = this.props
// console.log('UserDetails: ', userDetails)
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
     console.log('Infos Arr: ', arr)
     return arr
   }


  show(data){
    let infosObj = this.arrToObj(data.infos)
console.log('infosObj: '); console.log(infosObj)
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
    const {submitted, mUser} = this.state // mUser is modified user
    const { userDetails } = this.props
    const { oUser } = userDetails.data // oUser is original user

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
  showFlatNumber(infosObj) {
    return <div data-field-span="1">
        <Label>Flat/Apartment Number</Label>
        <Input
          type="text"
          name="flatNumber"
          placeholder="Enter Flat Number if applicablee"
          className="inputField"
          defaultValue={infosObj.flatNumber}
          onChange={this.handleInfosChange}
        />
      </div>
  }
  showResidentType(infosObj) {
    return <div data-field-span="1">
        <Label>Resident Type</Label>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              name="residenType"
              defaultValue={infosObj.residentType}
              onChange={this.handleInfosChange}
            /> Owner
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              name="residenType"
              defaultValue={infosObj.residentType}
              onChange={this.handleInfosChange}
            /> Tenant
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="radio"
              name="residenType"
              defaultValue={infosObj.residentType}
              onChange={this.handleInfosChange}
            /> Not Applicable
          </Label>
        </FormGroup>
      </div>
  }
  showFirstName(data) {
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
        {this.submitted && <FormText color="danger">First Name is required</FormText>}
      </div>
  }
  showLastName(data) {
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
        {this.submitted && <FormText color="danger">Last Name is required</FormText>}
      </div>
  }
  showEmail(data){
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
        {this.submitted && <FormText color="danger">Email-id is required</FormText>}
      </div>
  }
  showPassword(){
    return <div data-field-span="1">
      <Label>Password</Label>
      <Input
        type="password"
        name="password"
        placeholder="<enter password here>"
        title="Password is required"
        className="inputField"
        defaultValue={this.state.password}
        onChange={this.handlePasswordChange}
      />
      {this.state.passwordChanged &&
        <div data-field-span="1">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmpassword"
            placeholder="<repeat password here>"
            title="Confirm Password is required"
            className="inputField"
            defaultValue={this.state.confirmPassword}
            onChange={this.handleConfirmPasswordChange}
          />
          <FormText color="danger">Password do NOT match</FormText>
        </div>
      }
    </div>
  }
  showOtherEmails(infosObj){
    return <div data-field-span="1">
        <Label>Other email-ids</Label>
        <Input
          type="textarea"
          name="otherEmails"
          placeholder="example1@email.id, example2@email.id"
          title="Other eMail IDs of the User"
          className="inputField"
          defaultValue={infosObj.otherEmails}
          onChange={this.handleInfosChange}
          rows="2"
        />
      </div>
  }
  showMobileNumbers(infosObj) {
    return <div data-field-span="1">
      <Label>Cell/Mobile/Landline Numbers</Label>
      <Input
        type="textarea"
        name="cellNumbers"
        placeholder="eg: 9797097970, 044-27273030"
        title="Mobile or Landline Phone numbers of the User"
        className="inputField"
        defaultValue={infosObj.cellNumbers}
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  show2WheelerNumbers(infosObj) {
    return <div data-field-span="1">
      <Label>Regn No. of 2-wheeler(s) parked</Label>
      <Input
        type="textarea"
        name="twoWheelers"
        placeholder="eg: TN 11 CY 1234, TN 01 AZ 9876"
        title="Registration Number of Two Wheelers parked by the User"
        className="inputField"
        defaultValue={infosObj.twoWheelers}
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  show4WheelerNumbers(infosObj) {
    return <div data-field-span="1">
      <Label>Regn No. of 4-wheeler(s) parked</Label>
      <Input
        type="textarea"
        name="fourWheelers"
        placeholder="eg: TN 22 A 4567, TN 02 BD 789"
        title="Registration Number of Four Wheelers parked by the User"
        className="inputField"
        defaultValue={infosObj.fourWheelers}
        onChange={this.handleInfosChange}
        rows="2"
      />
    </div>
  }
  showEmergencyContacts(infosObj) {
    return <div data-field-span="1">
      <Label>Emergency Contact Details</Label>
      <Input
        type="textarea"
        name="emergencyContacts"
        placeholder="In case of emergency, whom to approach (such as relatives, friends), enter their name, address, or phone numbers here"
        title="Contact phone numbers in case of emergencies"
        className="inputField"
        defaultValue={infosObj.emergencyContacts}
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

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";
import { Profile } from "../../../collections/Profile";
import { Money } from "../../../collections/Money";
import { resetCardPin } from "../../../actions/card";
import {
  editProfile,
  updateSecurityQuestion,
  changePassword
} from "../../../actions/profile";

const ques1 = [
  {
    id: 0,
    question: "What was the name of your elementary / primary school?"
  },
  {
    id: 1,
    question: "In what city or town does your nearest sibling live?"
  },
  {
    id: 2,
    question: "What time of the day were you born?"
  },
  {
    id: 3,
    question: "What is your pet’s name?"
  },
  {
    id: 4,
    question: "In what year was your father born?"
  }
];

const ques2 = [
  {
    id: 0,
    question: "What school did you attend for sixth grade?"
  },
  {
    id: 1,
    question: "What was the last name of your third grade teacher?"
  },
  {
    id: 2,
    question: "In what city or town was your first job?"
  },
  {
    id: 3,
    question: "Who was your childhood hero? "
  },
  {
    id: 4,
    question: "What is your grandmother's first name?"
  }
];

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usdAmount: 0,
      container: "gold",
      material: "gold",
      customImg: "",
      showImgSave: false,
      imgUploading: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.profileStatus.profile.inProgress &&
      !nextProps.profileStatus.profile.inProgress &&
      nextProps.profileStatus.profile.successMessage
    ) {
      NotificationManager.success("Profile Updated Successfully", "", 3000);
    }
    if (
      this.props.profileStatus.profileQA.inProgress &&
      !nextProps.profileStatus.profileQA.inProgress &&
      nextProps.profileStatus.profileQA.successMessage
    ) {
      document.getElementById("editSecurityQuestion").reset();
      NotificationManager.success("Questions Updated Successfully", "", 3000);
    }
    if (
      this.props.profileStatus.password.inProgress &&
      !nextProps.profileStatus.password.inProgress &&
      nextProps.profileStatus.password.successMessage
    ) {
      document.getElementById("editchangepassword").reset();
      NotificationManager.success("Password Changed Successfully", "", 3000);
    }
    if (
      this.props.card.inProgress &&
      !nextProps.card.inProgress &&
      nextProps.card.successMessage
    ) {
      document.getElementById("resetPinform").reset();
      NotificationManager.success("Pin changed Successfully", "", 3000);
    }
  }
  handleSubmitProfile(e) {
    e.preventDefault();
    let fullname = e.target.fullname.value;
    let dob = e.target.dob.value;
    let address = e.target.address.value;
    let city = e.target.city.value;
    let state = e.target.state.value;
    let zip = e.target.zip.value;
    let phone = e.target.phone.value;
    this.props.editProfile({
      fullname,
      dob,
      address,
      city,
      state,
      zip,
      phone
    });
  }
  handleSubmitQuestion(e) {
    e.preventDefault();
    let passwd = e.target.passwd.value;
    let question1 = e.target.question1.value;
    let question2 = e.target.question2.value;
    let answer1 = e.target.answer1.value;
    let answer2 = e.target.answer2.value;
    this.props.updateSecurityQuestion({
      passwd,
      question1,
      question2,
      answer1,
      answer2
    });
  }
  handleSubmitPinChange(e) {
    e.preventDefault();
    let passwd = e.target.passwd.value;
    let pin = e.target.pin.value;
    let cpin = e.target.cpin.value;
    this.props.resetCardPin({
      passwd,
      pin,
      cpin
    });
  }
  handleSubmitPassword(e) {
    e.preventDefault();
    let oldpass = e.target.oldpass.value;
    let newpass = e.target.newpass.value;
    let cnewpass = e.target.cnewpass.value;
    this.props.changePassword({
      oldpass,
      newpass,
      cnewpass,
      email: this.props.profile.email
    });
  }
  componentWillMount() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }
  render() {
    const { money, profile } = this.props;
    const {
      profile: { error, errorMessage, inProgress, successMessage },
      profileQA: {
        error: Qerror,
        errorMessage: QerrorMessage,
        inProgress: QinProgress,
        successMessage: QsuccessMessage
      },
      password: {
        error: Perror,
        errorMessage: PerrorMessage,
        inProgress: PinProgress,
        successMessage: PsuccessMessage
      }
    } = this.props.profileStatus;
    if (!profile) {
      return <div>Loading...</div>;
    }
    return (
      <div
        className="kt-content  kt-grid__item kt-grid__item--fluid"
        id="kt_content"
      >
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 col-md-8 col-sm-12 kt-portlet">
            <div className="kt-portlet__head">
              <div className="kt-portlet__head-label">
                <h3 className="kt-portlet__head-title">Edit Your Profile</h3>
              </div>
            </div>

            <div className="kt-portlet__body">
              <form
                id="editprofile"
                className="kt-form kt-form--label-right"
                method="POST"
                role="form"
                onSubmit={this.handleSubmitProfile.bind(this)}
              >
                <div className="alert-text">
                  {error ? (
                    <div>
                      <span className="alert alert-danger col-sm-12">
                        {errorMessage}
                      </span>
                    </div>
                  ) : null}
                  {!profile.fullname ? (
                    <div className="alert alert-warning">
                      <p>
                        Please Fill your Profile Details Before Using Texas Gold
                        Card
                      </p>
                    </div>
                  ) : null}
                </div>

                {profile.merchant ? (
                  <div className="form-group col-lg-12">
                    <h2> You have a Merchant Account </h2>
                 
                    <div className="col-lg-4">
                      <h3>Merchant Fees:</h3>
                    </div>
                    <div className="col-lg-8">
                      <h4>{profile.merchantFee} %</h4>
                    </div>
                  </div>
                ) : null}
                <div className="form-group row">
                  <label
                    for="example-text-input"
                    className="col-2 col-form-label"
                  >
                    Profile Picture
                  </label>
                  <div className="col-10">
                    <img
                      src={
                        this.state.customImg
                          ? this.state.customImg
                          : profile.img
                      }
                      className="img-responsive img-rounded"
                      style={{ maxWidth: "250px", maxHeight: "250px" }}
                    />
                    <input
                      id="photo"
                      onChange={e => {
                        const self = this;
                        let file = e.target.files[0];
                        if (file) {
                          let reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = function() {
                            self.setState({
                              customImg: reader.result,
                              showImgSave: true
                            });
                          };
                        }
                      }}
                      accept="image/*"
                      type="file"
                    />
                    {this.state.showImgSave ? (
                      <div
                        style={{
                          paddingTop: "20px",
                          paddingLeft: "20px",
                          clear: "both"
                        }}
                      >
                        <button
                          onClick={() =>
                            this.setState({ customImg: "", showImgSave: false })
                          }
                          className="btn btn-info"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            const self = this;
                            self.setState({
                              imgUploading: true
                            });
                            let newImg = this.state.customImg; //base64
                            Meteor.call("uploadUserImg", newImg, (err, res) => {
                              self.setState({
                                showImgSave: false,
                                imgUploading: false
                              });
                            });
                          }}
                          disabled={this.state.imgUploading}
                          className="btn btn-success"
                        >
                          Save Profile Photo
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Full Name*
                  </label>
                  <div className="col-10">
                    <input
                      required
                      type="text"
                      autoFocus
                      className="form-control"
                      id="fullname"
                      name="fullname"
                      placeholder="Full Name"
                      defaultValue={profile.fullname}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-email-input"
                    className="col-2 col-form-label"
                  >
                    Date of Birth*
                  </label>
                  <div className="col-10">
                    <input
                      required
                      type="date"
                      className="form-control"
                      id="dob"
                      name="dob"
                      placeholder="Date Of Birth"
                      min="1900-01-01"
                      max={moment()
                        .subtract(13, "years")
                        .format("YYYY-MM-DD")}
                      defaultValue={profile.dob}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-url-input"
                    className="col-2 col-form-label"
                  >
                    Email*
                  </label>
                  <div className="col-10">
                    <input
                      required
                      type="email"
                      disabled
                      autoFocus
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Email"
                      defaultValue={profile.email}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-tel-input"
                    className="col-2 col-form-label"
                  >
                    Address*
                  </label>
                  <div className="col-10">
                    <textarea
                      required
                      className="form-control"
                      rows="4"
                      id="address"
                      name="address"
                      placeholder="Your Address"
                      defaultValue={profile.address}
                    ></textarea>
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-password-input"
                    className="col-2 col-form-label"
                  >
                    City
                  </label>
                  <div className="col-10">
                    <input
                      type="text"
                      required
                      className="form-control"
                      rows="4"
                      id="city"
                      name="city"
                      placeholder="City"
                      defaultValue={profile.city}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-datetime-local-input"
                    className="col-2 col-form-label"
                  >
                    State*
                  </label>
                  <div className="col-10">
                    <input
                      type="text"
                      required
                      className="form-control"
                      rows="4"
                      id="state"
                      name="state"
                      placeholder="State"
                      defaultValue={profile.state}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-month-input"
                    className="col-2 col-form-label"
                  >
                    ZipCode*
                  </label>
                  <div className="col-10">
                    <input
                      type="text"
                      maxLength="6"
                      required
                      className="form-control"
                      id="zip"
                      name="zip"
                      placeholder="Zip Code"
                      defaultValue={profile.zip}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-week-input"
                    className="col-2 col-form-label"
                  >
                    Phone No.*
                  </label>
                  <div className="col-10">
                    <input
                      type="text"
                      required
                      maxLength="15"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Phone No"
                      defaultValue={profile.phone}
                    />
                  </div>
                </div>

                <div className="kt-portlet__foot">
                  <div className="kt-form__actions">
                    <button type="submit" className="btn btn-primary">
                      Update Profile
                    </button>
                    <button type="reset" className="btn btn-secondary">
                      Reset
                    </button>
                  </div>
                </div>
              </form>

              
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 col-md-8 col-sm-12 kt-portlet">
            <div className="kt-portlet__head">
              <div className="kt-portlet__head-label">
                <h3 className="kt-portlet__head-title">Recovery Options</h3>
              </div>
            </div>
            <div className="kt-portlet__body">
              <form
                id="editSecurityQuestion"
                className="form-horizontal"
                role="form"
                onSubmit={this.handleSubmitQuestion.bind(this)}
              >
                {Qerror ? (
                  <div>
                    <span className="alert alert-danger col-sm-12">
                      {QerrorMessage}
                    </span>
                  </div>
                ) : null}

                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Your Account Password
                  </label>

                  <div className="col-10">
                    <input
                      type="password"
                      required
                      className="form-control"
                      name="passwd"
                      id="passwd"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Security Questions 1{" "}
                  </label>

                  <div className="col-10">
                    <select
                      name="question1"
                      id="question1"
                      data-id="1"
                      className="questions q1 form-control"
                      required="required"
                    >
                      {ques1.map(q => {
                        return (
                          <option value={q.id} key={q.id}>
                            {q.question}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Security Answer 1{" "}
                  </label>

                  <div className="col-10">
                    <input
                      type="password"
                      required
                      className="form-control"
                      id="answer1"
                      name="answer1"
                      placeholder="Your Answer"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Security Questions 2{" "}
                  </label>
                  <div className="col-10">
                    <select
                      name="question2"
                      id="question2"
                      className="questions q2 form-control"
                      required="required"
                    >
                      {ques2.map(q => {
                        return (
                          <option value={q.id} key={q.id}>
                            {q.question}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Security Answer 2{" "}
                  </label>
                  <div className="col-10">
                    <input
                      type="password"
                      required
                      className="form-control"
                      id="answer2"
                      name="answer2"
                      placeholder="Your Answer"
                    />
                  </div>
                </div>

                <div className="kt-portlet__foot">
                  <div className="kt-form__actions">
                    <button type="submit" className="btn btn-primary">
                      Update Security Details
                    </button>
                    <button type="reset" className="btn btn-secondary">
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 col-md-8 col-sm-12 kt-portlet">
            <div className="kt-portlet__head">
              <div className="kt-portlet__head-label">
                <h3 className="kt-portlet__head-title">Change Pin</h3>
              </div>
            </div>
            <div className="kt-portlet__body">
              <form
                onSubmit={this.handleSubmitPinChange.bind(this)}
                id="resetPinform"
                className="form-horizontal"
                role="form"
                method="post"
              >
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Your Account Password
                  </label>
                  <div className="col-10">
                    <input
                      type="password"
                      required
                      className="form-control"
                      name="passwd"
                      id="password"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    New Pin
                  </label>
                  <div className="col-10">
                    <input
                      type="password"
                      required
                      className="form-control"
                      name="pin"
                      placeholder="NEW PIN"
                      maxLength="4"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Confirm New Pin
                  </label>
                  <div className="col-10">
                    <input
                      type="password"
                      required
                      className="form-control"
                      name="cpin"
                      placeholder="Confirm Pin"
                      maxLength="4"
                    />
                  </div>
                </div>

                <div className="kt-portlet__foot">
                  <div className="kt-form__actions">
                    <button type="submit" className="btn btn-primary">
                      Change Pin
                    </button>
                    <button type="reset" className="btn btn-secondary">
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 col-md-8 col-sm-12 kt-portlet">
            <div className="kt-portlet__head">
              <div className="kt-portlet__head-label">
                <h3 className="kt-portlet__head-title">Change Password</h3>
              </div>
            </div>

            <div className="kt-portlet__body">
              <form
                onSubmit={this.handleSubmitPassword.bind(this)}
                id="editchangepassword"
                className="form-horizontal"
                method="POST"
                role="form"
              >
                {Perror ? (
                  <div>
                    <span className="alert alert-danger col-sm-12">
                      {PerrorMessage}
                    </span>
                  </div>
                ) : null}
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Old Password
                  </label>
                  <div className="col-10">
                    <input
                      type="password"
                      required
                      maxLength="15"
                      className="form-control"
                      id="oldpass"
                      name="oldpass"
                      placeholder="Old Password"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    New Password
                  </label>
                  <div className="col-10">
                    <input
                      type="password"
                      required
                      maxLength="15"
                      className="form-control"
                      id="newpass"
                      name="newpass"
                      placeholder="New Password"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="example-search-input"
                    className="col-2 col-form-label"
                  >
                    Confirm New Password
                  </label>

                  <div className="col-10">
                    <input
                      type="password"
                      required
                      maxLength="15"
                      className="form-control"
                      id="cnewpass"
                      name="cnewpass"
                      placeholder="Confirm New Password"
                    />
                  </div>
                </div>
                <div className="kt-portlet__foot">
                  <div className="kt-form__actions">
                    <button type="submit" className="btn btn-primary">
                      Change Password
                    </button>
                    <button type="reset" className="btn btn-secondary">
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    );
  }
}

const ProfileContainer = withTracker(props => {
  Meteor.subscribe("profile");
  Meteor.subscribe("balance");

  return {
    money: Money.findOne(),
    profile: Profile.findOne()
  };
})(ProfilePage);

function mapStateToProps(state) {
  return {
    user: state.user,
    profileStatus: state.profile,
    card: state.card
  };
}

function mapDispatchToProps(dispatch) {
  return {
    editProfile: data => dispatch(editProfile(data)),
    changePassword: data => dispatch(changePassword(data)),
    resetCardPin: data => dispatch(resetCardPin(data)),
    updateSecurityQuestion: data => dispatch(updateSecurityQuestion(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);

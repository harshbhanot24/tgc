import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { NotificationManager } from "react-notifications";

import { register, resetRegister } from '../../../actions/register';
import '../Login/style.scss';


const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      cpasswd: "",
      merchant: false,
      errors: {
        email: "",
        cpasswd: "",
        password: ""
      }
    };
  }
 componentDidMount() {
   this.setState({
     
      email: "",
      password: "",
      cpasswd: "",
      merchant: false,
      errors: {
        email: "",
        cpasswd: "",
        password: ""
      }             
  })
  }
  handleRegister = event => {
    event.preventDefault();
    if (this.state.email.length>0 && validateForm(this.state.errors)) {
      const { email, password, cpasswd } = this.state;
      this.props.registerUser({
        email,
        password,
        cpasswd,
        membership: "gold",
        merchant: this.state.merchant
      });
    } else {
      console.error("Invalid Form");
    }
  };

  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "password":
        errors.password =
          value.length < 8 ? "Password must be 8 characters long!" : "";
        break;
      case "cpasswd":
        errors.cpasswd =
          value !== this.state.password
            ? "Password don't match, try again!"
            : "";
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };
  componentWillReceiveProps(nextProps) {
    if (
      this.props.register.inProgress &&
      !nextProps.register.inProgress &&
      nextProps.register.successMessage
    ) {
      this.setState({
        email: "",
        password: "",
        cpasswd: "",
        merchant: false,
        errors: {
          email: "",
          cpasswd: "",
          password: ""
        }
      });
      // nextProps.history.push("/register/success"); 
    }
  }
  render() {
    const {
      error,
      errorMessage,
      successMessage,
      inProgress
    } = this.props.register;
    const { errors } = this.state;
    const { merchant } = this.state;
    const fullSizeDiv = {
      width: "100%",
      minHeight: "100vh",
      maxHeight: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      margin: "0 auto"
    };
    const styles = { backgroundImage: `url("/assets/media/bg/bg-4.jpg")` };
    return (
      <div className="kt-grid kt-grid--ver kt-grid--root" style={fullSizeDiv}>
        <div
          className="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v1"
          id="kt_login"
        >
          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
            <div
              className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2  kt-grid kt-grid--hor kt-login__aside"
              style={styles}
            >
              <div className="kt-grid__item">
                <a href="#" className="kt-login__logo">
                  <img src="/assets/media/logos/logo-4.png" />
                </a>
              </div>
              <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                <div className="kt-grid__item kt-grid__item--middle">
                  <h3 className="kt-login__title">
                    Welcome to Thomas Jefferson Gold!
                  </h3>
                  <h4 className="kt-login__subtitle">
                    Please Login to your account or if you don't have account,
                    click on Sign uP to join our community.
                  </h4>
                </div>
              </div>
              <div className="kt-grid__item">
                <div className="kt-login__info">
                  <div className="kt-login__copyright">
                    &copy 2020 Thomas Jefferson Gold
                  </div>
                  <div className="kt-login__menu">
                    <a href="#" className="kt-link">
                      Privacy
                    </a>
                    <a href="#" className="kt-link">
                      Legal
                    </a>
                    <a href="#" className="kt-link">
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
              <div className="kt-login__head">
                <span className="kt-login__signup-label">
                  Already have an account!
                </span>
                &nbsp;&nbsp;
                <Link to="/login">Sign In</Link>
              </div>

              <div className="kt-login__body">
                <div className="kt-login__form">
                  <div className="kt-login__title">
                    <h3>Sign Up</h3>
                  </div>

                  <form className="kt-form" id="signupform" onSubmit={this.handleRegister}>
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        noValidate
                      />
                    </div>
                    {errors.email.length > 0 && (
                      <span className="error">{errors.email}</span>
                    )}
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        noValidate
                      />
                      {errors.password.length > 0 && (
                        <span className="error">{errors.password}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Confirm Password"
                        name="cpasswd"
                        value={this.state.cpasswd}
                        onChange={this.handleChange}
                        noValidate
                      />
                      {errors.cpasswd.length > 0 && (
                        <span className="error">{errors.cpasswd}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="planselectionFOR"
                        className="col-md-3 control-label"
                      >
                        SignUp For
                      </label>
                      <div className="col-md-9">
                        <label className="radio-inline">
                          <input
                            type="radio"
                            checked={!merchant}
                            value="customer"
                            name="planselectionFOR"
                            onChange={() => {
                              this.setState({ merchant: false });
                            }}
                          />
                          Basic &nbsp;
                        </label>
                        <label className="radio-inline">
                          <input
                            type="radio"
                            checked={merchant}
                            value="merchant"
                            name="planselectionFOR"
                            onChange={() => {
                              this.setState({ merchant: true });
                            }}
                          />
                          Merchant
                        </label>
                      </div>
                    </div>
                    <div className="kt-login__actions">
                      <button
                        id="kt_login_signin_submit"
                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                        disabled={!validateForm(this.state.errors)}
                        type="submit"
                      >
                        Sign Up
                      </button>
                    </div>
                    {error ? (
                      <div>
                        <span
                          id="login-alert"
                          className="alert alert-danger col-sm-12"
                        >
                          {errorMessage}
                        </span>
                      </div>
                    ) : null}
                    {!inProgress && successMessage ? (
                      <div>
                        <span
                          id="login-alert"
                          className="alert alert-success col-sm-12"
                        >
                          {successMessage}
                        </span>
                      </div>
                    ) : null}
                  </form>
                  <div className="kt-login__actions">
                    <span>
                      By Clicking SignUp you are Accepting our &nbsp;
                      <a
                        href="http://www.texasgoldcard.com/commercial-terms-&-conditions.html"
                        target="_blank"
                      >
                        Commercial Terms &amp; Conditions
                      </a>{" "}
                      &amp; &nbsp;
                      <a
                        href="http://www.texasgoldcard.com/member-terms-&-conditions.html"
                        target="_blank"
                      >
                        Members Terms &amp; Conditions
                      </a>
                    </span>
                  </div>
                  <div className="kt-login__divider">
                    <div className="kt-divider">
                      <span></span>
                      <span>OR</span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    register: state.register
  }
}

function mapDispatchToProps(dispatch) {
  return {
    registerUser: (data) => { dispatch(register(data)) },
    resetRegister: () => { dispatch(resetRegister()) }
    // fetchPokemon: bindActionCreators(fetchPokemon, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)

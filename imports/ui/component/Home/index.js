import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import { login, resetLogin } from "../../../actions/login";
import "./style.scss";



const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};
class Login extends React.Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    this.autoClose = urlParams.get("autoClose");
    this.state = { email: "", password: "",
      errors: {
        email: "",
        password: ""
      }
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'email': 
        errors.email =
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'password': 
        errors.password = 
          value.length < 8
            ? 'Password must be 8 characters long!'
            : '';
        break;
      default:
        break;
    }

    this.setState({errors, [name]: value});
  }
  componentWillMount() {
    const { resetLogin } = this.props;
    resetLogin();
  }
  handleSubmit = (event) => {
    event.preventDefault();
    
    if(validateForm(this.state.errors)) {
     let isWindow= this.autoClose? this.autoClose : true;
      const {email, password } = this.state;
      this.props.login({
        email,
        password,
        autoClose: isWindow,
      });
    }else{
      console.error('Invalid Form')
    }
    }
  componentWillReceiveProps(nextProps) {
    if (!this.props.user.error && nextProps.user.error) {
      this.setState({
        password: ""
      });
    }
  }

  render() {
    const { errors } = this.state;
    const styles = { backgroundImage: `url("/assets/media/bg/bg-4.jpg")` };
    const { error, errorMessage, inProgress } = this.props.user;
    const fullSizeDiv={ 
    width: "100%",
    minHeight: "100vh",
    maxHeight: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    margin: "0 auto"
}
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
                  Don't have an account yet?
                </span>
                &nbsp;&nbsp;
                <Link to="/register" className="kt-link kt-login__signup-link">
                  Sign Up!
                </Link>
              </div>

              <div className="kt-login__body">
                <div className="kt-login__form">
                  <div className="kt-login__title">
                    <h3>Sign In</h3>
                  </div>

                  <form className="kt-form" onSubmit={this.handleSubmit}>
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

                    <div className="kt-login__actions">
                      <Link
                        to="/forgot"
                        className="kt-link kt-login__link-forgot"
                      >
                        Forgot Password ?
                      </Link>
                      <button
                        id="kt_login_signin_submit"
                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                        disabled={inProgress}
                        type="submit"
                      >
                        Sign In
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
                  </form>

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
const LoginContainer = withTracker(props => ({
  userData: Meteor.user()
}))(Login);

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: data => {
      dispatch(login(data));
    },
    resetLogin: () => {
      dispatch(resetLogin());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);

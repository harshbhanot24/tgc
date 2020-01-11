import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";

import { login, resetLogin } from "../../../actions/login";
import "./style.scss";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
  }

  componentWillMount() {
    const { resetLogin } = this.props;
    resetLogin();
  }

  handleLogin(e) {
    e.preventDefault();
    const { email } = this.state;
    const { password } = this.state;
    this.props.login({
      email,
      password
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user.error && nextProps.user.error) {
      this.setState({
        password: ""
      });
    }
  }

  render() {
    const { error, errorMessage, inProgress } = this.props.user;
    return (
      <div class="kt-header--fixed kt-header-mobile--fixed kt-subheader--fixed kt-subheader--enabled kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">
        <div class="kt-grid kt-grid--ver kt-grid--root">
          <div
            class="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v1"
            id="kt_login"
          >
            <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
              <div
                class="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
                style="background-image: url(assets/media//bg/bg-4.jpg);"
              >
                <div class="kt-grid__item">
                  <a href="#" class="kt-login__logo">
                    <img src="assets/media/logos/logo-4.png" />
                  </a>
                </div>
                <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                  <div class="kt-grid__item kt-grid__item--middle">
                    <h3 class="kt-login__title">
                      Welcome to Thomas Jefferson Gold!
                    </h3>
                    <h4 class="kt-login__subtitle">
                      Please Login to your account or if you don't have account,
                      click on Sign uP to join our community.
                    </h4>
                  </div>
                </div>
                <div class="kt-grid__item">
                  <div class="kt-login__info">
                    <div class="kt-login__copyright">
                      &copy 2020 Thomas Jefferson Gold
                    </div>
                    <div class="kt-login__menu">
                      <a href="#" class="kt-link">
                        Privacy
                      </a>
                      <a href="#" class="kt-link">
                        Legal
                      </a>
                      <a href="#" class="kt-link">
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
                <div class="kt-login__head">
                  <span class="kt-login__signup-label">
                    Don't have an account yet?
                  </span>
                  &nbsp;&nbsp;
                  <a href="#" class="kt-link kt-login__signup-link">
                    Sign Up!
                  </a>
                </div>

                <div class="kt-login__body">
                  <div class="kt-login__form">
                    <div class="kt-login__title">
                      <h3>Sign In</h3>
                    </div>

                    <form class="kt-form" action="" novalidate="novalidate">
                      <div class="form-group">
                        <input
                          class="form-control"
                          type="text"
                          placeholder="Email"
                          name="email"
                          autocomplete="off"
                        />
                      </div>
                      <div class="form-group">
                        <input
                          class="form-control"
                          type="password"
                          placeholder="Password"
                          name="password"
                        />
                      </div>

                      <div class="kt-login__actions">
                        <a href="#" class="kt-link kt-login__link-forgot">
                          Forgot Password ?
                        </a>
                        <button
                          id="kt_login_signin_submit"
                          class="btn btn-primary btn-elevate kt-login__btn-primary"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>

                    <div class="kt-login__divider">
                      <div class="kt-divider">
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
      </div>
    );
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

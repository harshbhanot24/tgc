import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { NotificationManager } from "react-notifications";

import { forgot, resetLogin } from "../../../actions/login";
import "./style.scss";

class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
  }
  componentWillMount() {
    this.props.resetLogin();
  }
  handleForgot(e) {
    e.preventDefault();
    const email = this.state.email;
    this.props.forgot({
      email
    });
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.forgotPassword.inProgress &&
      !nextProps.forgotPassword.inProgress &&
      nextProps.forgotPassword.successMessage
    ) {
      NotificationManager.success(
        nextProps.forgotPassword.successMessage,
        "",
        3000
      );
      this.props.history.push("/login");
    }
  }
  render() {
    const { error, errorMessage, inProgress } = this.props.forgotPassword;
    const styles = { backgroundImage: `url("/assets/media/bg/bg-4.jpg")` };
    const fullSizeDiv = {
      width: "100%",
      minHeight: "100vh",
      maxHeight: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      margin: "0 auto"
    };
    return (
      <div className="kt-grid kt-grid--ver kt-grid--root" style={fullSizeDiv}>
        <div
          className="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v1"
          id="kt_login"
        >
          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
            <div
              className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
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
                    Please enter your registered e-mail address to reset
                    password.
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
                  Already have an account?
                </span>
                &nbsp;&nbsp;
                <Link to="/login" className="kt-link kt-login__signup-link">
                  Sign In!
                </Link>
              </div>

              <div className="kt-login__body">
                {error ? (
                  <div>
                    <span
                      id="login-alert"
                      classNameName="alert alert-danger col-sm-12"
                    >
                      {errorMessage}
                    </span>
                  </div>
                ) : null}

                <div className="kt-login__form">
                  <div className="kt-login__title">
                    <h3>Reset Password</h3>
                  </div>

                  <form
                    className="kt-form"
                    action=""
                    onSubmit={this.handleForgot.bind(this)}
                  >
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={this.state.email}
                        onChange={e => {
                          this.setState({ email: e.target.value });
                        }}
                      />
                    </div>

                    <div className="kt-login__actions">
                      <a href="#" className="kt-link kt-login__link-forgot"></a>
                      <button
                        id="kt_login_signin_submit"
                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                        disabled={inProgress}
                        type="submit"
                      >
                        Send reset mail
                      </button>
                    </div>
                  </form>
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
    forgotPassword: state.user.forgot
  };
}

function mapDispatchToProps(dispatch) {
  return {
    forgot: data => {
      dispatch(forgot(data));
    },
    resetLogin: () => {
      dispatch(resetLogin());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Forgot);

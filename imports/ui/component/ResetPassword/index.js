import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { NotificationManager } from "react-notifications";

import { resetPassword } from '../../../actions/login';
import './style.scss';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cpassword:'',password:''}
  }
  componentWillMount() {
  }
  handleResetPassword(e) {
    e.preventDefault();
    const token = this.props.match.params.token;
    const password = this.state.password;
    const cpassword = this.state.cpassword;
    this.props.resetPassword({
      token,
      cpassword,
      password
    })
  }
  componentWillReceiveProps(nextProps) {
    if(!this.props.reset.error && nextProps.reset.error) {
      this.setState({
        password: '',
        cpassword: ''
      })
    }
    if(this.props.reset.inProgress && !nextProps.reset.inProgress && nextProps.reset.successMessage) {
      NotificationManager.success(nextProps.forgotPassword.successMessage,"",3000);
      this.props.history.push('/login')
    }
  }
  render() {
    const {error, errorMessage, inProgress} = this.props.reset;
    return (
      <div className="loginbox mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
        <div className="panel panel-info">
        <div className="panel-heading">
          <div className="panel-title">Reset Password</div>
          <div className='panel-head-right-text'>
            <Link to="/login">Sign In?</Link>
          </div>
        </div>
          <div className="pt-30 panel-body">
          {
            error?
            <div>
              <span id="login-alert" className="alert alert-danger col-sm-12">{errorMessage}</span>
            </div>
            :
            null
          }
          <form id="resetform" onSubmit={this.handleResetPassword.bind(this)} className="form-horizontal" role="form" method="post">
            <div className="input-group mb-25">
                <span className="input-group-addon">
                <i className="glyphicon glyphicon-lock"></i></span>
                <input value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}} id="login-password" minLength="8" type="password" className="form-control" name="password" placeholder="Password" />
            </div>
            <div className="input-group mb-25">
                <span className="input-group-addon">
                <i className="glyphicon glyphicon-lock"></i></span>
                <input value={this.state.cpassword} onChange={(e)=>{this.setState({cpassword:e.target.value})}} id="login-cpassword" minLength="8" type="password" className="form-control" name="cpassword" placeholder="Confirm Password" />
            </div>
              <div className="form-group mt-10">
                  <div className="col-sm-12 controls">
                    <button disabled={inProgress} type="submit" id="btn-login" href="#" className="btn btn-success">Reset</button>
                  </div>
              </div>
              </form>
          </div>
      </div>
  </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    reset: state.user.reset
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: (data)=> {dispatch(resetPassword(data))},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)

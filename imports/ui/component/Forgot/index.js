import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { NotificationManager } from "react-notifications";

import { forgot, resetLogin } from '../../../actions/login';
import './style.scss';

class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email:'',password:''}
  }
  componentWillMount() {
    this.props.resetLogin();
  }
  handleForgot(e) {
    e.preventDefault();
    const email = this.state.email;
    this.props.forgot({
      email
    })
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.forgotPassword.inProgress && !nextProps.forgotPassword.inProgress && nextProps.forgotPassword.successMessage) {
      NotificationManager.success(nextProps.forgotPassword.successMessage,"",3000);
      this.props.history.push('/login')
    }
  }
  render() {
    const {error, errorMessage, inProgress} = this.props.forgotPassword;
    return (
      <div className="loginbox mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
        <div className="panel panel-info">
        <div className="panel-heading">
          <div className="panel-title">Forgot</div>
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
          <form id="loginform" onSubmit={this.handleForgot.bind(this)} className="form-horizontal" role="form" method="post">
            <div className="input-group mb-25">
              <span className="input-group-addon">
                <i className="fa fa-user"></i></span>
                <input value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}} autoFocus id="login-username" type="email" className="form-control" name="username" placeholder="Email" />
            </div>
            <div className="form-group mt-10">
                <div className="col-sm-12 controls">
                  <button disabled={inProgress} type="submit" id="btn-login" href="#" className="btn btn-success">Forgot Password</button>
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
    forgotPassword: state.user.forgot
  }
}

function mapDispatchToProps(dispatch) {
  return {
    forgot: (data)=> {dispatch(forgot(data))},
    resetLogin: ()=> {dispatch(resetLogin())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Forgot)

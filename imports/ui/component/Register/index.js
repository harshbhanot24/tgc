import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { NotificationManager } from "react-notifications";

import { register, resetRegister } from '../../../actions/register';
import '../Login/style.scss';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email:'',password:'',merchant:false}
  }
  componentWillMount() {
    this.props.resetRegister()
  }
  handleRegister(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.passwd.value;
    const cPassword = e.target.cpasswd.value;
    this.props.registerUser({
      email,
      password,
      cPassword,
      membership: 'gold',
      merchant: this.state.merchant
    })
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.register.inProgress && !nextProps.register.inProgress && nextProps.register.successMessage) {
      document.getElementById("signupform").reset();
      nextProps.history.push('/register/success');
    }
  }
  render() {
    const {error, errorMessage, successMessage, inProgress} = this.props.register;
    const { merchant } = this.state;
    return (
      <div className="loginbox mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
        <div className="panel panel-info">
          <div className="panel-heading">
              <div className="panel-title">Sign Up</div>
              <div className='panel-head-right-text'>
                <Link id="signinlink" to="/login">Sign In</Link></div>
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
          {
            !inProgress && successMessage?
            <div>
              <span id="login-alert" className="alert alert-success col-sm-12">{successMessage}</span>
            </div>
            :
            null
          }
            <form id="signupform" className="form-horizontal" role="form" method="post" onSubmit={this.handleRegister.bind(this)}>
                <div className="form-group">
                    <label htmlFor="email" className="col-md-3 control-label">Email</label>
                    <div className="col-md-9">
                        <input type="email" autoFocus className="form-control" name="email" required placeholder="Email Address" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="col-md-3 control-label">Password</label>
                    <div className="col-md-9">
                        <input type="password" required className="form-control" name="passwd" placeholder="Password" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="cpassword" className="col-md-3 control-label">Confirm Password</label>
                    <div className="col-md-9">
                        <input type="password" required className="form-control" name="cpasswd" placeholder="Confirm Password" />
                    </div>
                </div>
                  {
                    /*
                    <label htmlFor="planselection" className="col-md-3 control-label">Select Card Type</label>
                    <div className="col-md-9">
                        <label className="radio-inline">
                            <input type="radio" defaultChecked value="gold" name="planselection" />Gold
                        </label>
                        <label className="radio-inline">
                            <input type="radio" value="silver" name="planselection" />Silver
                        </label>
                    </div>
                    */
                  }
                <div className="form-group">
                    <label htmlFor="planselectionFOR" className="col-md-3 control-label">SignUp For</label>
                    <div className="col-md-9">
                        <label className="radio-inline">
                            <input type="radio" checked={!merchant} value="customer" name="planselectionFOR" onChange={()=>{
                                this.setState({merchant: false})
                              }} />Basic
                        </label>
                        <label className="radio-inline">
                            <input type="radio" checked={merchant} value="merchant" name="planselectionFOR" onChange={()=>{
                                this.setState({merchant: true})
                              }} />Merchant
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-offset-3 col-md-9 control">
                        <div style={{fontSize: "14px"}} >
                            By Clicking SignUp you are Accepting our
                            <a href="http://www.texasgoldcard.com/commercial-terms-&-conditions.html" target="_blank">
                                Commercial Terms &amp; Conditions
                            </a> &amp; &nbsp;
                            <a href="http://www.texasgoldcard.com/member-terms-&-conditions.html" target="_blank">
                                Members Terms &amp; Conditions
                            </a>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-offset-3 col-md-9">
                        <button id="btn-signup" name="signUpButton" type="submit" className="btn btn-warning btn-lg input-lg"><i className="icon-hand-right"></i>Sign Up</button>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-12 control">
                        <div className="sign-in">
                            Already have an account!
                            <Link to='/login'>
                                Sign In
                            </Link>
                        </div>
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
    register: state.register
  }
}

function mapDispatchToProps(dispatch) {
  return {
    registerUser: (data)=> {dispatch(register(data))},
    resetRegister: ()=> {dispatch(resetRegister())}
    // fetchPokemon: bindActionCreators(fetchPokemon, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)

import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import Modal from 'react-bootstrap-modal';
import { withTracker } from 'meteor/react-meteor-data';
import { login } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import DatePicker from 'react-16-bootstrap-date-picker';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';

import UTILS from '../../../util'

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    let email = e.target.email.value;
    let passwd = e.target.passwd.value;
    if(!UTILS.isValidPassword(passwd,email)) {
      NotificationManager.error('Password must be at least 7 character long alpha numeric');
    } else {
      Meteor.call('registerNewUser', email, passwd, false, function(error, result) {
          if (result) {
            NotificationManager.success('User Successfully Created');
            self.props.history.push('/manage-users');
          } else {
              if (error.error == 403) {
                  NotificationManager.error('Email Already Registered')
              } else {
                NotificationManager.error(error.reason);
              }
          }
      });
    }
  }
  componentWillMount() {
    const self = this;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // Meteor.subscribe('balance');
    // this.props.getTodayTJSent();
    // this.props.getTodayTJReceive();
  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { money, profile, gold, user} = this.props;
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="message_wrapper">
          <h4 className="heading">Create Users</h4>
      </div>
      <div>
          <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
          <i className="fa fa-4x fa-arrow-left pointer" id="goBack" aria-hidden="true"></i>
      </div>
      <div id="signupbox" style={{marginTop: '50px'}} className="mainbox col-md-10 col-sm-10">
          <div className="panel panel-info">
              <div className="panel-heading">
                  <div className="panel-title">Add New User</div>
              </div>
              <div className="panel-body">
                  <form onSubmit={this.handleSubmit.bind(this)} id="signupform" className="form-horizontal" role="form" method="post">
                      <div className="form-group">
                          <label htmlFor="email" className="col-md-3 control-label">User Email</label>
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
                          <div className="col-md-offset-3 col-md-9">
                              <button id="btn-signup" name="signUpButton" type="submit" className="btn btn-primary btn-lg input-lg"><i className="icon-hand-right"></i>Add User</button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    </section>
    )
  }
}

const AddUserContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne(),
    gold: Gold.findOne()
  }
})(AddUser);


function mapStateToProps(state) {
  return {
    user: state.user,
    transaction: state.user.transactions || []
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // getTodayTJSent: ()=> dispatch(getTodayTJSent()),
    // getTodayTJReceive: ()=> dispatch(getTodayTJReceive())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUserContainer)

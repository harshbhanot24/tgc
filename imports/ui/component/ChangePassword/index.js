import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import {
  Accounts
} from 'meteor/accounts-base';
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { withTracker } from 'meteor/react-meteor-data';
import { login } from '../../../actions/login';
import UTIL from '../../../util'
import { Profile } from '../../../collections/Profile';
import { ExtraSpot } from '../../../collections/ExtraSpot';
import DatePicker from 'react-16-bootstrap-date-picker';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';
import { StaffActivity } from '../../../collections/StaffActivity';
import { StaffRequest } from '../../../collections/StaffRequest';
// import { getTodayTJSent, getTodayTJReceive } from '../../../actions/login';

import UTILS from '../../../util'

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userTransactions: [],
      search:''
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
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    let oldpasswd = e.target.oldpasswd.value;
    let passwd = e.target.passwd.value;
    let cpasswd = e.target.cpasswd.value;
    if(passwd !== cpasswd) {
      NotificationManager.error('Password don\'t match','',3000);
      return;
    } else if(!UTIL.isValidPassword(passwd, '')) {
      NotificationManager.error('Password must be alpha numeric at least 7 character long','',3000);
      return;
    } else {
      Accounts.changePassword(oldpasswd, passwd, function(error) {
          if (error) NotificationManager.error(error.reason,'',3000);
          else {
            NotificationManager.success('Password change successfully.','',3000);
            self.props.history.push('/');
          }
      });
    }
  }
  render() {
    const { money, profile,extraSpot, gold, user} = this.props;
    const { userTransactions } = this.state;
    const self = this;
    return (
      <section className="dashboard container bg-white">
        <div className="right_col" role="main">
          <br/>
          <div className="">
            <div className="message_wrapper">
                <h4 className="heading">Manage Account</h4>
            </div>
          <div>
            <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
          </div>
          <div className="panel panel-info" >
            <div className="panel-heading">
                <div className="panel-title">Change Password</div>
            </div>
            <div style={{paddingTop: '30px'}} className="panel-body" >
              <form onSubmit={this.handleSubmit.bind(this)} id="resetpassword" className="form-horizontal" role="form" method="post">
                <div style={{marginBottom: '25px'}} className="col-lg-12">
                    <input autoFocus id="oldpasswd" type="password" className="form-control" name="oldpasswd"  required placeholder="Old Password" />
                </div>
                <div style={{marginBottom: '25px'}} className="col-lg-12">
                    <input required id="passwd" type="password" className="form-control" name="passwd"  placeholder="New Password" />
                </div>
                <div style={{marginBottom: '25px'}} className="col-lg-12">
                    <input required id="cpasswd" type="password" className="form-control" name="cpasswd"  placeholder="Confirm New Password" />
                </div>
                <div style={{marginTop: '10px'}} className="form-group">
                    <div className="col-lg-offset-1 col-lg-4 controls">
                        <button type="submit" id="btn-login" name="resetlink" href="#" className="btn btn-info">Change Password</button>
                    </div>
                </div>
              </form>
          </div>
      </div>
      </div>
    </div>
  </section>
    )
  }
}

const ChangePasswordContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne()
  }
})(ChangePassword);


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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordContainer)

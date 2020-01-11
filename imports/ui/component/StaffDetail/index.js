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
import DatePicker from 'react-16-bootstrap-date-picker';

import UTILS from '../../../util'

class StaffDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      user: {}
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    let passwd = e.target.passwd.value;
    const params = this.props.match.params;
    const {userId} = params;
    if(!UTILS.isValidPassword(passwd, '')) {
      NotificationManager.error('Password must be at least 7 character long alpha numeric');
      return;
    }
    Meteor.call('changeAPassword', userId, passwd, function(error, result) {
      if(!error) {
        NotificationManager.success('Password Change successfully','',3000);
        document.getElementById('resetPassword').reset()
        return;
      }
      NotificationManager.error('Something went wrong. Please try again','',3000);
    });
  }
  componentWillMount() {
    const self = this;
    const params = this.props.match.params;
    const {userId} = params;
    if(!userId) {
      this.props.history.push('/');
    } else {
      console.log(userId);
      Meteor.call('getStaffData',userId, function(err,res){
        // console.log(res);
        if(res) {
          self.setState({
            user:res
          })
        } else {
          NotificationManager.error('Something Went Wrong. Unable to Fetch Data. Try Again');
          self.props.history.push('/manage-staff');
        }
      });
    }
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;

  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const self = this;
    const user = this.state.user || {};
    return (
    <section className="dashboard container bg-white">
      <div className="message_wrapper">
          <h4 className="heading">{user.fullname}</h4>
      </div>
      <div>
          <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
          <Link to="/manage-staff"><i className="fa fa-4x fa-arrow-left pointer" id="goBack" aria-hidden="true"></i></Link>
      </div>
      <table className="table table-bordered table-hover table-responsive">
        <tbody>
            <tr>
                <td>Full Name</td>
                <td>{user.profile?user.profile.name:''}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>{user.username}</td>
            </tr>

            <tr>
              <td>Change Password</td>
              <td>
                <form role="form" onSubmit={this.handleSubmit.bind(this)} action="#" id="resetPassword" method="post">
                  <input type="password" name="passwd" className="form-control" required="required" title="Password" placeholder="New Password" />
                  <br/>
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </form>
              </td>
            </tr>
          </tbody>
      </table>
    </section>
    )
  }
}

const StaffDetailContainer = withTracker((props)=>{
  return {
  }
})(StaffDetail);


function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // getTodayTJSent: ()=> dispatch(getTodayTJSent()),
    // getTodayTJReceive: ()=> dispatch(getTodayTJReceive())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StaffDetailContainer)

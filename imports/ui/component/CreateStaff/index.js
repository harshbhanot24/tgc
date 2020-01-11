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
import { Gold } from '../../../collections/Gold';

import UTILS from '../../../util'

class CreateStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      type: 'normal'
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    let name = e.target.name.value;
    let email = e.target.email.value;
    let passwd = e.target.passwd.value;
    let type = this.state.type || 'normal';
    if(!UTILS.isValidPassword(passwd, email)) {
      NotificationManager.error('Passowrd must be atleast 7 character long alphanumeric.')
      return;
    } else {
      Meteor.call('registerNewStaff', name,email,passwd,type === 'moderator', function (error, result) {
        self.setState({loading: false})
        if(result)
        {
          NotificationManager.success('Successfully Registered');
          self.props.history.push('/manage-staff');
        }
        else
          NotificationManager.error(error.reason);
      });
    }
  }
  componentWillMount() {
    const self = this;

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;

  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="message_wrapper">
          <h4 className="heading">Create Users</h4>
      </div>
      <div>
          <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
          <Link to="/manage-staff"><i className="fa fa-4x fa-arrow-left pointer" id="goBack" aria-hidden="true"></i></Link>
      </div>
      <div id="signupbox" style={{marginTop:'50px'}} className="mainbox col-md-10 col-sm-10">
        <div className="panel panel-info">
          <div className="panel-heading">
              <div className="panel-title">Add New Staff</div>
          </div>
            <div className="panel-body">
              <form id="signupform" onSubmit={this.handleSubmit.bind(this)} className="form-horizontal" role="form" method="post">
                <div className="form-group">
                    <label htmlFor="name" className="col-md-3 control-label">Name</label>
                    <div className="col-md-9">
                        <input type="name" id="name" autoFocus className="form-control" name="name" required placeholder="FullName" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="col-md-3 control-label">User Email</label>
                    <div className="col-md-9">
                        <input type="email" id="email" className="form-control" name="email" required placeholder="Email Address" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="col-md-3 control-label">Password</label>
                    <div className="col-md-9">
                        <input type="password" id="password" required className="form-control" name="passwd" placeholder="Password" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="planselection" className="col-md-3 control-label">Select Staff Type</label>
                    <div className="col-md-9">
                        <label className="radio-inline">
                            <input type="radio" checked={this.state.type === 'normal'} onChange={(e)=>{
                                if(e.target.checked) {
                                  self.setState({
                                    type: 'normal'
                                  })
                                }
                              }} value="false" name="planselection" />Normal
                        </label>
                        <label className="radio-inline">
                            <input onChange={(e)=>{
                                if(e.target.checked) {
                                  self.setState({
                                    type: 'moderator'
                                  })
                                }
                              }} checked={this.state.type === 'moderator'} type="radio" value="true" name="planselection" />Moderator
                        </label>
                    </div>
                </div>
                <div className="form-group">
                  <div className="col-md-offset-3 col-md-9">
                    <button disabled={this.state.loading} id="btn-signup" name="signUpButton" type="submit" className="btn btn-primary btn-lg input-lg"><i className="icon-hand-right"></i>Add User</button>
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

const CreateStaffContainer = withTracker((props)=>{
  return {
    gold: Gold.findOne()
  }
})(CreateStaff);


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

export default connect(mapStateToProps, mapDispatchToProps)(CreateStaffContainer)

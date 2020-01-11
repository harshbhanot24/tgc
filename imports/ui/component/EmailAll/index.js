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

class EmailAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    let message = e.target.message.value;
    let subject = e.target.subject.value;
    self.setState({loading: true});
    Meteor.call('sendEmailToAll', subject, message, function(err, res){
      self.setState({loading: false})
      if (res) {
        NotificationManager.success('Email Successfully Sent To All Members');
        document.getElementById('sendEmail').reset();
        return true;
      } else {
        NotificationManager.error(err.reason);
      }
    });

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
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="right_col user_col" role="main">
      <br/>
      <div className="">
          <div className="message_wrapper">
            <h4 className="heading">Send Email To All Members</h4>
          </div>
          <div>
            <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
          </div>
          <form onSubmit={this.handleSubmit.bind(this)} action="#" method="GET" id="sendEmail" role="form">
              <legend>Send Email to All Members</legend>
              <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" required className="form-control" id="subject" name="subject" placeholder="Subject" />
              </div>
              <div className="form-group">
                  <label htmlFor="subject">Message Body</label>
                  <textarea required name="message" placeholder="Message" id="message" className="form-control"></textarea>
              </div>
              <button disabled={this.state.loading} type="submit" className="btn btn-primary">Send</button>
            </form>
        </div>
    </div>

    </section>
    )
  }
}

const EmailAllContainer = withTracker((props)=>{
  return {
  }
})(EmailAll);


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

export default connect(mapStateToProps, mapDispatchToProps)(EmailAllContainer)

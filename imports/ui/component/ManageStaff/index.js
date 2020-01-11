import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { withTracker } from 'meteor/react-meteor-data';
import DatePicker from 'react-16-bootstrap-date-picker';
import { Gold } from '../../../collections/Gold';

import UTILS from '../../../util'

class ManageStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      staff: []
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
  }
  componentWillMount() {
    const self = this;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    Meteor.call('getStaffDetail', function(error, result) {
      self.setState({
        staff: result
      })
    });
  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const staff = this.state.staff || [];
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="right_col" role="main">
        <br/>
        <div className="">
          <div className="message_wrapper">
              <h4 className="heading">Manage Users</h4>
          </div>
          <div>
              <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
          </div>
          <Link to="/create-staff" className="btn btn-default btn-lg input-lg" id="CreateUser">
            <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Create New Staff Member
          </Link>
          <div className="table-responsive">
            <br/><br/>
            <table className="table table-hover">
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>isModerator</th>
                  </tr>
              </thead>
              <tbody>
                {
                  staff.map(s=>{
                    return (
                      <tr key={s._id} className='pointer'>
                          <td>{s.fullname}</td>
                          <td>{s.email}</td>
                          <td>{s.moderator?'Yes':'No'}</td>
                          <td>
                            <Link to={"/manage-staff/"+s._id} id="openUserDetails" className="btn btn-primary btn-sm">View Details</Link>
                          </td>
                      </tr>
                    )
                  })
                }
                {
                  staff.length === 0 ?
                    <tr>
                        <td colSpan="4">No User Register Yet</td>
                    </tr>
                  :
                    null
                }
              </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
    )
  }
}

const ManageStaffContainer = withTracker((props)=>{
  return {
    gold: Gold.findOne()
  }
})(ManageStaff);


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

export default connect(mapStateToProps, mapDispatchToProps)(ManageStaffContainer)

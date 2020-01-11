import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { login } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import { ExtraSpot } from '../../../collections/ExtraSpot';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';
import { StaffActivity } from '../../../collections/StaffActivity';
import { StaffRequest } from '../../../collections/StaffRequest';
// import { getTodayTJSent, getTodayTJReceive } from '../../../actions/login';

import UTILS from '../../../util'

import './style.scss';

class StaffDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentWillMount() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // Meteor.subscribe('balance');
    // this.props.getTodayTJSent();
    // this.props.getTodayTJReceive();
  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { money, profile,staffActivity,staffRequest, extraSpot, gold, user} = this.props;
    return (
      <section className="dashboard container bg-white">
        <div className="right_col" role="main">
          <div className="">
            <div className="page-title">
              <div className="title_left">
                <h3>Staff Dashboard</h3>
              </div>

            </div>
            <div className="clearfix"></div>
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="x_panel">
                  <div className="x_title">
                    <div className="clearfix"></div>
                  </div>
                  <div className="x_content">
                    <div className="col-md-3 col-sm-3 col-xs-12 profile_left">
                      <div className="profile_img">
                        <div id="crop-avatar">
                          <div className="avatar-view" title="">
                            <img src={user.profile.userImg} alt="Avatar" />
                          </div>
                          <div className="loading" aria-label="Loading" role="img" tabIndex="-1"></div>
                        </div>
                      </div>
                      <h3>{user.profile.name}</h3>
                      <ul className="list-unstyled user_data">
                        <li><i className="fa fa-map-marker user-profile-icon"></i> Staff (TJGOLD)
                        </li>
                      </ul>
                      <Link to='/change-password' className="btn btn-success" id="changePassword"><i className="fa fa-edit m-right-xs"></i>Edit Password</Link>
                      <br />
                    </div>
                    <div className="col-md-9 col-sm-9 col-xs-12">
                      <div className="profile_title">
                        <div className="col-md-6">
                          <h2>Recent Activity</h2>
                        </div>
                      </div>
                      <div className="" role="tabpanel" data-example-id="togglable-tabs">
                        <ul id="myTab" className="nav nav-tabs bar_tabs" role="tablist">
                          <li role="presentation" className="active"><a href="#tab_content1" id="home-tab" role="tab" data-toggle="tab" aria-expanded="true">Recent Activity</a>
                        </li>
                        <li role="presentation" className=""><a href="#tab_content2" id="home-tab2" role="tab" data-toggle="tab" aria-expanded="true">Requests</a>
                      </li>
                  </ul>
                  <div id="myTabContent" className="tab-content">
                    <div role="tabpanel" className="tab-pane fade active in" id="tab_content1" aria-labelledby="home-tab">
                      <ul className="messages">
                        {
                          staffActivity.map((s,i)=>{
                              return (
                                <li key={i}>
                                  <img src={s.img} className="avatar" alt="Avatar" />
                                  <div className="message_date">
                                    <h3 className="date text-info" style={{fontSize:'20px'}}>{s.numberOfBarCoin} barCoin</h3>
                                  </div>
                                  <div className="message_wrapper">
                                    <h4 className="heading">{s.name}</h4>
                                  <blockquote style={{fontSize:'16px'}} className="message">{s.message}
                                  </blockquote>
                                  <br />
                                </div>
                                </li>
                              )
                          })
                        }
                        {
                          !staffActivity.length?
                            <li>No Recent Activiy</li>
                            :
                            null
                        }
                    </ul>
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="tab_content2" aria-labelledby="home-tab2">
                    <ul className="messages">
                      {
                        staffRequest.map(s=>{
                          return (
                            <li key={s._id}>
                              <img src={s.img} className="avatar" alt="Avatar" />
                              <div className="message_date">
                              </div>
                              <div className="message_wrapper">
                                <h4 className="heading">{s.name}</h4>
                              <blockquote style={{fontSize:'16px'}} className="message">{s.message}</blockquote>
                              <br />
                                <div className="col-md-6">
                                <a href="#!" className="btn btn-sm btn-success success" onClick={()=>{
                                    Meteor.call('acceptRequest', s._id, function (error, result) {
                                    });
                                  }}>
                                  <i className="fa fa-2x fa-check" style={{color:'#fff'}}></i>
                                </a>
                                <a href="#!" className="btn btn-sm btn-danger reject" onClick={()=>{
                                    Meteor.call('rejectRequest', s._id, function (error, result) {});
                                  }}>
                                  <i className="fa fa-2x fa-times" style={{color: '#fff'}}></i>
                                </a>
                                </div><br/>
                            </div>
                            <br/>
                          </li>
                          )
                        })
                      }
                      {
                        !staffRequest.length?
                        <li>No Recent Requests</li>
                        :
                        null
                      }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
      </section>
    )
  }
}

const DashboardContainer = withTracker((props)=>{
  Meteor.subscribe('activity');
  Meteor.subscribe('requestA');
  return {
    profile: Profile.findOne(),
    money: Money.findOne(),
    extraSpot: ExtraSpot.findOne(),
    gold: Gold.findOne(),
    staffActivity: StaffActivity.find({}, {sort: {date: -1},limit:20}).fetch(),
    staffRequest: StaffRequest.find({requestStatus:undefined}, {sort: {date: -1},limit:20}).fetch()
  }
})(StaffDashboard);


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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer)

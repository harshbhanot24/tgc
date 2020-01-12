import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { login } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import { ExtraSpot } from '../../../collections/ExtraSpot';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';
// import { getTodayTJSent, getTodayTJReceive } from '../../../actions/login';

import UTILS from '../../../util'

import './style.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }
  componentWillMount() {

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // Meteor.subscribe('profile');
    // Meteor.subscribe('balance');
    // this.props.getTodayTJSent();
    // this.props.getTodayTJReceive();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.profile && !nextProps.profile.fullname) {
      nextProps.history.push('/profile');
    }
  }
  handleLogin(e) {
    e.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    this.props.login({
      email,
      password
    })
  }
  render() {
    const { money, profile, extraSpot, gold, user, transaction } = this.props;
    let userGold = '';
    if (money)
      userGold = parseFloat(money.gold);
    const goldValue = gold ? parseFloat(gold.data) : '';
    let getTJBalanceUSD;
    if (goldValue && userGold !== '' && extraSpot) {
      const totalTJ = (userGold * goldValue) * extraSpot.multiplier;
      getTJBalanceUSD = UTILS.currencyFormat(parseFloat(totalTJ).toFixed(2));
    }
    const todayTJSent = user.todayTJSent;
    const todayTJReceive = user.todayTJReceive;
    return (
      <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
        <div
          className="kt-content  kt-grid__item kt-grid__item--fluid"
          id="kt_content"
        >
          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8 col-md-8 col-sm-12">
              <div className="kt-portlet">
                <div className="kt-portlet__body  kt-portlet__body--fit">
                  <div className="row row-no-padding row-col-separator-xl">
                    <div className="col-md-12 col-lg-6 col-xl-3">
                      <div className="kt-widget24">
                        <div className="kt-widget24__details">
                          <div className="kt-widget24__info">
                            <h4 className="kt-widget24__title">Gold Balance</h4>
                            <span className="kt-widget24__desc">
                              in ounce(s)
                            </span>
                          </div>
                          <span className="kt-widget24__stats kt-font-brand">
                            {userGold !== ""
                              ? userGold.toFixed(5)
                              : "Loading..."}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-lg-6 col-xl-3">
                      <div className="kt-widget24">
                        <div className="kt-widget24__details">
                          <div className="kt-widget24__info">
                            <h4 className="kt-widget24__title">
                              Gold Dollar Balance
                            </h4>
                            <span className="kt-widget24__desc">Converted</span>
                          </div>
                          <span className="kt-widget24__stats kt-font-warning">
                            {getTJBalanceUSD !== undefined
                              ? getTJBalanceUSD
                              : "Loading..."}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-lg-6 col-xl-3">
                      <div className="kt-widget24">
                        <div className="kt-widget24__details">
                          <div className="kt-widget24__info">
                            <h4 className="kt-widget24__title">Amount Sent</h4>
                            <span className="kt-widget24__desc">Today</span>
                          </div>
                          <span className="kt-widget24__stats kt-font-danger">
                            {todayTJSent}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-lg-6 col-xl-3">
                      <div className="kt-widget24">
                        <div className="kt-widget24__details">
                          <div className="kt-widget24__info">
                            <h4 className="kt-widget24__title">
                              Amount Recieved
                            </h4>
                            <span className="kt-widget24__desc">Today</span>
                          </div>
                          <span className="kt-widget24__stats kt-font-success">
                            {todayTJReceive}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kt-portlet kt-portlet--mobile">
                <div className="kt-portlet__head kt-portlet__head--lg">
                  <div className="kt-portlet__head-label">
                    <span className="kt-portlet__head-icon">
                      <i className="kt-font-brand flaticon2-line-chart"></i>
                    </span>
                    <h3 className="kt-portlet__head-title">Transactions</h3>
                  </div>
                  <div className="kt-portlet__head-toolbar">
                    <div className="kt-portlet__head-wrapper">
                      <div className="kt-portlet__head-actions">
                        <a
                          href="#"
                          className="btn btn-brand btn-elevate btn-icon-sm"
                        >
                          <i className="la la-file-image-o"></i>
                          Transaction Statements
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div >
                  <table >
                    <thead>
                      <tr>
                        <th >Transaction ID</th>
                        <th >From</th>
                        <th >To</th>
                        <th >Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>0006-3629</td>
                        <td>Land Rover</td>
                        <td>Range Rover</td>
                        <td>2016-11-28</td>
                      </tr>
                      <tr>
                        <td>66403-315</td>
                        <td>GMC</td>
                        <td>Jimmy</td>
                        <td>2017-04-29</td>
                      </tr>
                      {transaction.map((data, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <Link to={"/transaction/" + data._id}>
                                {data._id}
                              </Link>
                            </td>
                            <td>{`${data.FromName}(${data.FromCard}) sent ${data.Fromgold}`}</td>
                            <td>{`${data.ToName}(${data.ToCard}) received ${data.Togold}`}</td>
                            <td>{moment(data.Date).format("LLL")}</td>
                          </tr>
                        );
                      })}
                      {transaction.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No Transaction Done
                          </td>
                        </tr>
                      ) : (
                        "null"
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-lg-2"></div>
          </div>
        </div>
      </div>
    );
  }
}

const DashboardContainer = withTracker((props) => {
  Meteor.subscribe('Gold')
  Meteor.subscribe('Silver')
  Meteor.subscribe('Multiplier');
  Meteor.subscribe('profile');
  Meteor.subscribe('balance');
  return {
    profile: Profile.findOne(),
    money: Money.findOne(),
    extraSpot: ExtraSpot.findOne(),
    gold: Gold.findOne()
  }
})(Dashboard);


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

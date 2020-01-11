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
    if(nextProps.profile && !nextProps.profile.fullname) {
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
    if(money)
      userGold = parseFloat(money.gold);
    const goldValue = gold?parseFloat(gold.data):'';
    let getTJBalanceUSD;
    if(goldValue && userGold !== '' && extraSpot){
      const totalTJ =   (userGold * goldValue)*extraSpot.multiplier;
      getTJBalanceUSD = UTILS.currencyFormat(parseFloat(totalTJ).toFixed(2));
    }
    const todayTJSent = user.todayTJSent;
    const todayTJReceive = user.todayTJReceive;
    return (
      <section className="dashboard container">
       <div className="row alert-info" style={{padding:"20px", color:'#000'}}>
          <div className="col-lg-3">
              <div className="panel panel-default">
                  <div className="panel-body text-center">
                      <h3>Gold Balance</h3>
                      <br/>
                      <h4>
                        {
                          userGold !== '' ?
                            userGold.toFixed(5) + ' ounce(s)'
                            :
                            'Loading...'
                        }
                      </h4>
                  </div>
              </div>
          </div>
          <div className="col-lg-3">
              <div className="panel panel-default">
                   <div className="panel-body text-center">
                      <h3>Gold Dollar Balance</h3><br/>
                      <h4>{getTJBalanceUSD !== undefined ?getTJBalanceUSD:'Loading...'}</h4>
                  </div>
              </div>
          </div>
          <div className="col-lg-3">
              <div className="panel panel-default">
                   <div className="panel-body text-center">
                      <h5>Today</h5><h3>Amount Sent</h3>
                      <h4>{todayTJSent}</h4>
                  </div>
              </div>
          </div>
          <div className="col-lg-3">
              <div className="panel panel-default">
                   <div className="panel-body text-center">
                      <h5>Today</h5><h3>Amount Recieved</h3>
                      <h4>{todayTJReceive}</h4>
                  </div>
              </div>
          </div>
      </div>
      <section className="table">
          <h3>Recent Transactions</h3>
            <div className="row">
                <div className="panel panel-primary filterable">
                    <div className="panel-heading transaction-panel">
                        <h3 className="panel-title">Transaction Logs</h3>
                    </div>
                    <table className="table">
                        <thead>
                            <tr className="filters">
                                <th><input type="text" className="form-control" placeholder="From" disabled /></th>
                                <th><input type="text" className="form-control" placeholder="To" disabled /></th>
                                <th><input type="text" className="form-control" placeholder="TransactionID" disabled /></th>
                                <th><input type="text" className="form-control" placeholder="Date" disabled /></th>
                            </tr>
                        </thead>
                        <tbody>
                          {
                            transaction.map((data,i)=>{
                              return (
                                <tr key={i}>
                                  <td>{`${data.FromName}(${data.FromCard}) sent ${data.Fromgold}`}</td>
                                  <td>{`${data.ToName}(${data.ToCard}) received ${data.Togold}`}</td>
                                  <td><Link to={"/transaction/"+data._id}>{data._id}</Link></td>
                                  <td>{moment(data.Date).format('LLL')}</td>
                                </tr>
                              )
                            })
                          }
                          {
                            transaction.length === 0?
                              <tr><td colSpan="7" className="text-center">No Transaction Done</td></tr>
                            :
                            null
                          }
                        </tbody>
                    </table>
                    <div className="pull-right">
                        <Link to="/transaction">View All Transaction</Link>
                    </div>
                </div>
            </div>
      </section>
  </section>
    )
  }
}

const DashboardContainer = withTracker((props)=>{
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

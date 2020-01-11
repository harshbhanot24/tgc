import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { withTracker } from 'meteor/react-meteor-data';
import { login } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import { ExtraSpot } from '../../../collections/ExtraSpot';
import DatePicker from 'react-16-bootstrap-date-picker';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';
import { StaffActivity } from '../../../collections/StaffActivity';
import { StaffRequest } from '../../../collections/StaffRequest';
// import { getTodayTJSent, getTodayTJReceive } from '../../../actions/login';

import UTILS from '../../../util'

class ReverseTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userTransactions: [],
      search:''
    }
  }
  componentWillMount() {
    const self = this;
    Meteor.call('getUserTransaction', "all", 0, null, null, "", function(error, result) {
        self.setState({userTransactions: result || []});
    });
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // Meteor.subscribe('balance');
    // this.props.getTodayTJSent();
    // this.props.getTodayTJReceive();
  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { money, profile,extraSpot, gold, user} = this.props;
    const { userTransactions } = this.state;
    const self = this;
    return (
      <section className="dashboard container bg-white">
      <div className="right_col" role="main">
        <div className="">
          <div className="page-title">
            <div className="title_left">
              <h2>Reverse Transaction</h2>
            </div>
          </div>
          <div className="clearfix"></div>
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="x_panel">
                <div className="x_title">
                  <div className="clearfix"></div>
                </div>
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    let search = this.state.search || '';
                    Meteor.call('getUserTransaction', "all", 0, null, null, search, function(error, result) {
                        self.setState({userTransactions: result});
                    });
                  }}>
                <legend>Search</legend>
                  <input type="text" value={this.state.search} onChange={(e)=>{
                      this.setState({search: e.target.value})
                    }} id="searchBox" placeholder="Search Transaction Id" className="form-control"/>
                </form>
                <table className="table table-hover">
                    <thead>
                        <tr className="filters">
                            <th><input type="text" className="form-control" placeholder="From" disabled/></th>
                            <th><input type="text" className="form-control" placeholder="To" disabled/></th>
                            <th><input type="text" className="form-control" placeholder="TransactionID" disabled/></th>
                            <th><input type="text" className="form-control" placeholder="Date" disabled/></th>
                            <th><input type="text" className="form-control" placeholder="Action" disabled/></th>
                        </tr>
                    </thead>
                    <tbody>
                      {
                        userTransactions.map((t,i)=>{
                          return (
                            <tr key={t._id}>
                                <td>{t.FromName}({t.FromCard}) sent {t.Fromgold}</td>
                                <td>{t.ToName}({t.ToCard}) received {t.Togold}</td>
                                <td>{t._id}</td>
                                <td>{moment(t.Date).format('LLL')}</td>
                                {
                                  t.remarks && t.remarks.match(/refund transaction/i) === null ?
                                    <td><button onClick={()=>{
                                        const result = confirm('Are you sure you want Reverse the transaction?');
                                        if (result) {
                                          Meteor.call('reverseTransaction', t._id, function(err, res) {
                                              //updateRefresh
                                              if(err){
                                                NotificationManager.error(err.reason,"",3000);
                                              }
                                              else{
                                                NotificationManager.success("Transaction reverse Successfully","",3000);
                                                self.setState({search:''})
                                                Meteor.call('getUserTransaction', "all", 0, null, null, "", function(error, result) {
                                                    self.setState({userTransactions: result || []});
                                                });
                                              }
                                          });
                                        }
                                      }} className="btn btn-primary reverseT">Reverse Transaction</button></td>
                                  :
                                  <td><button className="btn btn-success"> Transaction Reversed*</button></td>
                                }
                            </tr>
                          )
                        })
                      }
                      {
                        !userTransactions.length ?
                        <tr><td colSpan="4" className="text-center">No Transaction Done</td></tr>
                        :
                        null
                      }
                    </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    )
  }
}

const ReverseTransactionContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne(),
    money: Money.findOne(),
    extraSpot: ExtraSpot.findOne(),
    gold: Gold.findOne()
  }
})(ReverseTransaction);


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

export default connect(mapStateToProps, mapDispatchToProps)(ReverseTransactionContainer)

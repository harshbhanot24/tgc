import { Scrollbars } from 'react-custom-scrollbars';
import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Modal from 'react-bootstrap-modal';
import { login } from '../../../actions/login';
import { NotificationManager } from "react-notifications";
import { Profile } from '../../../collections/Profile';
import { ExtraSpot } from '../../../collections/ExtraSpot';
import DatePicker from 'react-16-bootstrap-date-picker';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';
import { StaffActivity } from '../../../collections/StaffActivity';
import { StaffRequest } from '../../../collections/StaffRequest';
// import { getTodayTJSent, getTodayTJReceive } from '../../../actions/login';

import UTILS from '../../../util'

class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayGoldPurchase: 0,
      todaySilverPurchase: 0,
      todaySignUp : 0,
      getHouseTJg: 0,
      getP : 0,
      purchaseRequestCount: 0,
      merchantRequestCount : 0,
      getGoldLeft: 0,
      transactions:[],
      singleTransaction:{}
    }
    this.closeModal = this.closeModal.bind(this)
  }
  componentWillMount() {
    const self = this;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    Meteor.call('getPurchaseMerchantRequestCount',function(err,res){
      self.setState({
        merchantRequestCount: res[0],
        purchaseRequestCount: res[1]
      })
    })
    Meteor.call('getTodayGoldPurchase',"gold", function (error, result) {
        self.setState({
          todayGoldPurchase: result?result.toFixed(5):0
        })
    });
    Meteor.call('getTodayGoldPurchase',"silver", function (error, result) {
        self.setState({
          todaySilverPurchase: result?result.toFixed(5):0
        })
    });
    Meteor.call('getTodaySignUp', function (error, result) {
      self.setState({
        todaySignUp: result || 0
      })
    });
    Meteor.call('getHouseTJ', 'gold', function (error, result) {
      self.setState({
        getHouseTJg: result || 0
      })
    });
    Meteor.call('getP', 'gold', function (error, result) {
      self.setState({
        getHouseTJg: result || 0
      })
    });
    Meteor.call('getUserTransaction', "all", 0, null, null, "", function(error, result) {
        self.setState({transactions: result || []});
    });
    Meteor.call('leftAmount', "gold", function (error, result) {
        self.setState({getGoldLeft: result});
    });
    // Meteor.subscribe('balance');
    // this.props.getTodayTJSent();
    // this.props.getTodayTJReceive();
  }
  componentWillReceiveProps(nextProps) {

  }
  handleSubmit(e) {
    e.preventDefault();

  }
  closeModal() {
    this.setState({
      singleTransaction: {}
    })
  }

  render() {
    const { money, profile, gold, user} = this.props;
    const {
      todayGoldPurchase,
      todaySilverPurchase,
      todaySignUp,
      getHouseTJg,
      getP,
      purchaseRequestCount,
      merchantRequestCount,
      getGoldLeft,
      transactions,
      singleTransaction
    } = this.state;
    const self = this;
    return (
      <section className="dashboard container bg-white">
        <div className="right_col" role="main">
          <br/>
          <div className="">
            <div className="message_wrapper">
                <h4 className="heading">Admin Dashboard</h4>
            </div>
            <div>
                <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
            </div>
            <div className="row top_tiles">
              <div className="animated flipInY col-lg-3 col-md-3 col-md-6 col-xs-12">
                <div className="tile-stats">
                    <div className="count2">
                      {todayGoldPurchase} (Gold) <br/>
                      {todaySilverPurchase} (Silver)
                    </div>
                    <h3>Gold/Silver Purchased</h3>
                    <p>Gold/Silver ounces Purchased Today</p>
                </div>
              </div>
              <div className="animated flipInY col-lg-3 col-md-3 col-md-6 col-xs-12">
                <div className="tile-stats">
                    <div className="count2">{todaySignUp}</div>
                    <h3># of User Register</h3>
                    <p>New registered user count in the last 24 hours.</p>
                </div>
              </div>
              <div className="animated flipInY col-lg-3 col-md-3 col-md-6 col-xs-12">
                <div className="tile-stats">
                    <div className="count2">
                      {getHouseTJg} Gold Ounces
                      <button onClick={()=>{
                        Meteor.call('transferToVault',function(err,res){
                         if(res){
                             Meteor.call('getHouseTJ',"gold", function (error, result) {
                               self.setState({
                                 getHouseTJg: result
                               })
                             });
                             Meteor.call('leftAmount', "gold", function (error, result) {
                               self.setState({
                                 getGoldLeft: result
                               })
                             });
                             NotificationManager.success('Successfully Transferred', '',4000);
                           } else {
                             NotificationManager.error(err.reason, '',4000);
                           }
                         });
                        }} type="button" id="house2vault" className="btn btn-primary">Transfer to Vault</button>
                    </div>
                    <p>House Balance in Gold Ounces</p>
                </div>
              </div>
              <div className="animated flipInY col-lg-3 col-md-3 col-md-6 col-xs-12">
                <div className="tile-stats">
                    <div className="count2">{getP} %</div>
                    <p>Extra Spot Price Percentage</p>
                </div>
              </div>
              <div className="animated flipInY col-lg-3 col-md-3 col-md-6 col-xs-12">
                <div className="tile-stats">
                    <div className="count2">{purchaseRequestCount}</div>
                    <p>Pending Purchase Request Count</p>
                </div>
            </div>
            <div className="animated flipInY col-lg-3 col-md-3 col-md-6 col-xs-12">
                <div className="tile-stats">
                    <div className="count2">{merchantRequestCount}</div>
                    <p>New Merchant Request Count</p>
                </div>
            </div>
            <div className="animated flipInY col-lg-3 col-md-3 col-md-6 col-xs-12">
                <div className="tile-stats">
                    <div className="count2">{getGoldLeft} (Gold Ounces)</div>
                    <p>Available Vault Balance For Purchase</p>
                </div>
            </div>
        </div>
        <blockquote style={{fontWeight: '600'}} className="message">Recent Transactions</blockquote>
        <div className="row" >
          <div className="col-md-12 col-md-12 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                  Recent Trasactions
              </div>
              <div className="panel-body">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                      <thead>
                          <tr>
                              <th>#</th>
                              <th>From</th>
                              <th>SentAmount(GoldDollar)</th>
                              <th>To</th>
                              <th>RecievedAmount(GoldDollar)</th>
                              <th>TransactionId(GoldDollar)</th>
                              <th>Date</th>
                          </tr>
                      </thead>
                      <tbody>
                        {
                          transactions.map((t,i)=>{
                            return (
                              <tr key={t._id}>
                                <td>{i+1}</td>
                                <td>{t.FromName}({t.FromCard})</td>
                                <td>{t.Fromgold}</td>
                                <td>{t.ToName}({t.ToCard})</td>
                                <td>{t.Togold}</td>
                                <td className='pointer' onClick={()=>{
                                    this.setState({
                                      singleTransaction: t
                                    })
                                  }}>{t._id}</td>
                                <td>{moment(t.Date).format('LLL')}</td>
                              </tr>
                            )
                          })
                        }
                        {
                          !transactions.length && <tr>
                              <td colSpan="7" className="text-center">No Transaction To Display</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    </div>
      <Modal
          show={Boolean(singleTransaction._id)}
          onHide={this.closeModal}
          aria-labelledby="PrivacyPolicy"
        >
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{height:'70vh'}}>
          <Scrollbars>
            <div className="table-responsive">
                <table className="table table-hover">
                    <tbody>
                        <tr>
                            <td><b>Transaction Id</b></td>
                            <td>{singleTransaction._id}</td>
                        </tr>
                        <tr>
                            <td><b>Sender Name</b></td>
                            <td>{singleTransaction.FromName}</td>
                        </tr>
                        <tr>
                            <td><b>Sender Card Number</b></td>
                            <td>{singleTransaction.FromCard}</td>
                        </tr>
                        <tr>
                            <td><b>Reciever Name</b></td>
                            <td>{singleTransaction.ToName}</td>
                        </tr>
                        <tr>
                            <td><b>Reciever Card Number</b></td>
                            <td>{singleTransaction.ToCard}</td>
                        </tr>
                        <tr>
                            <td><b>Gold Dollar Transfer</b></td>
                            <td>{singleTransaction.FromTJTransfer} Gold Dollar</td>
                        </tr>
                        <tr>
                            <td><b>Sender's Remarks</b></td>
                            <td>{singleTransaction.remarks}</td>
                        </tr>
                        <tr>
                            <td><b>Date &amp; Time</b></td>
                            <td>{moment(singleTransaction.Date).format('LLL')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </Scrollbars>
        </Modal.Body>
      </Modal>
    </div>
  </div>
</section>
    )
  }
}

const AdminDashboardContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne(),
    money: Money.findOne(),
    extraSpot: ExtraSpot.findOne(),
    gold: Gold.findOne()
  }
})(AdminDashboard);


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

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboardContainer)

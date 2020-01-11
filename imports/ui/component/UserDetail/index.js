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

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      transactions: [],
      chargeLoading: false
    }
    this.closeModal = this.closeModal.bind(this)
  }
  closeModal() {
    this.setState({
    })
  }
  handleChangePassword(e) {
    e.preventDefault();
    let passwd = e.target.passwd.value;
    const params = this.props.match.params;
    const {userId} = params;
    if(!UTILS.isValidPassword(passwd, '')) {
      NotificationManager.error('Password must be at least 7 character long alpha numeric');
      return;
    }
    //change password
    Meteor.call('changeAPassword', userId, passwd, function(error, result) {
      if(!error){
        NotificationManager.success('Password Change successfully','',3000);
        document.getElementById('resetPasswordForm').reset()
        return;
      }
      NotificationManager.error('Something went wrong. Please try again','',3000);
    });
  }
  handleCharge(e) {
    e.preventDefault();
    let amount = e.target.amount.value;
    let remarks = e.target.remarks.value;
    const self = this;
    let currentTJ = this.props.user.tjg;
    const params = this.props.match.params;
    const {userId} = params;
    if(currentTJ < amount) {
      NotificationManager.error('User has insufficient balance');
      return;
    } else {
      this.setState({chargeLoading: true})
      Meteor.call('chargeByAdmin', userId, amount, remarks, (err, res) => {
        self.setState({chargeLoading: false})
          if (res) {
              NotificationManager.success('Amount Transfer to HouseTJ Account','',3000)
              document.getElementById('chargeForm').reset()
              return true;
          } else {
              NotificationManager.error(err.reason,'',3000);
          }
      });
    }
  }
  componentWillMount() {
    const self = this;
    const params = this.props.match.params;
    const {userId} = params;
    if(!userId) {
      this.props.history.push('/');
    } else {
      Meteor.call('getAllUsersDetail',0,20, userId, function(err,res){
        if(res && res.length > 0) {
          self.setState({
            user:res[0]
          })
          Meteor.call('getUserTransaction', userId, 0, null, function(error, result) {
            if(result)
              self.setState({
                transactions: result
              })
          });
        } else {
          NotificationManager.error('Something Went Wrong. Unable to Fetch Data. Try Again');
          self.props.history.push('/manage-users');
        }
      });


    }
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }

  render() {
    const { money, profile, gold} = this.props;
    const { user, transactions } = this.state;
    const self = this;
    return (
      <section className="dashboard container bg-white">
        <div className="message_wrapper">
            <h4 className="heading">{user.fullname}</h4>
        </div>
        <div>
            <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
            <i className="pointer fa fa-4x fa-arrow-left" onClick={()=>{
                this.props.history.push('/manage-users');
              }} id="goBack" aria-hidden="true"></i>
        </div>
        <table className="table table-bordered table-hover table-responsive">
      <tbody>
          <tr>
              <td>Full Name</td>
              <td>{user.fullname}</td>
          </tr>
          <tr>
              <td>Email</td>
              <td>{user.email}</td>
          </tr>
          <tr>
              <td>Address</td>
              <td>{user.address}</td>
          </tr>
          <tr>
              <td>Phone</td>
              <td>{user.phone}</td>
          </tr>
          <tr>
              <td>Balance(Gold Dollar)</td>
              <td>{user.tjg}</td>
          </tr>
          <tr>
          <td>Change Password</td>
          <td>
              <form role="form" id="resetPasswordForm" onSubmit={this.handleChangePassword.bind(this)} method="post">
                  <input id="resetPassword" type="password" name="passwd" className="form-control" required="required" title="Password" placeholder="New Password"/>
                  <br/>
                  <button type="submit" className="btn btn-primary">Change Password</button>
              </form>
            </td>
          </tr>
          {user.merchant &&
            <tr>
              <td>Change Merchant Fees</td>
              <td><form id="merchantfee" role="form" action="#" method="post">
                  <input type="number" step="any" name="percent" maxlength="4" id="inputPercent" className="form-control" required="required" title="Merchant Percentage Fees" value={user.merchantFee} placeholder="Merchant Percentage Fees"/><br/>
                  <button type="submit" className="btn btn-primary">Change Fee</button>
                </form>
              </td>
            </tr>
          }

          </tbody>
      </table>
      <br/>
      <br/>
    <div className="row" >
        <div className="col-md-12 col-sm-12 col-xs-12">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <legend>Charge User(GoldDollar)</legend>
                </div>
                <div className="panel-body" style={{overflow: 'hidden'}}>
                    <div className="table-responsive">
                      <form id="chargeForm" onSubmit={this.handleCharge.bind(this)}>
                        <div className="row form-group">
                            <div className="col-md-4">
                                Amount(Gold Dollar)
                            </div>
                            <div className="col-md-8">
                                <input step="any" type="number" min="0" name="amount" id="amount" className="form-control" value="" required="required"/>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-md-4">
                                Remarks
                            </div>
                            <div className="col-md-8">
                                <textarea name="remarks" id="remarks" className="form-control" required="required"></textarea>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-sm-8 col-sm-offset-4">
                                <button disabled={this.state.chargeLoading} id="chargeit" type="submit" className="btn btn-primary btn-lg input-lg">Charge It</button>
                            </div>
                        </div>
                      </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="row" >
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="panel panel-default">
              <div className="panel-heading">
                  <legend>Recent Transaction By User</legend>
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

  </section>
    )
  }
}

const UserDetailContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne(),
    gold: Gold.findOne()
  }
})(UserDetail);


function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // getTodayTJReceive: ()=> dispatch(getTodayTJReceive())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailContainer)

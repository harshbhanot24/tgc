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
import { ExtraSpot } from '../../../collections/ExtraSpot';
import { PurchaseRequest } from '../../../collections/PurchaseRequest';
import { Gold } from '../../../collections/Gold';

import UTILS from '../../../util'

class PurchaseRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goldLeft:0,
      silverLeft: 0,
      selectedRequest: {}
    }
    this.closeModal = this.closeModal.bind(this)
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    let multiplier = e.target.multiplier.value;
    let password = e.target.password.value;
    if(!password) {
      NotificationManager.error('Password require to change Multipier');
      return;
    }
    Meteor.call('changeMultiplier', multiplier, password, (err, res) => {
      if (res) {
        NotificationManager.success("Multiplier Updated Successfully");
        document.getElementById('password').value = '';
      } else {
        if(err)
          NotificationManager.error(err.reason);
        else
          NotificationManager.error('Please enter valid password.');
      }
    });
  }
  closeModal() {
    this.setState({
      selectedRequest: {}
    })
  }
  componentWillMount() {
    const self = this;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    Meteor.call('leftAmount', "gold", function(error, result) {
      self.setState({
        goldLeft: result
      })
    });
    Meteor.call('leftAmount', "silver", function(error, result) {
      self.setState({
        silverLeft: result
      })
    });
    // Meteor.subscribe('balance');
    // this.props.getTodayTJSent();
    // this.props.getTodayTJReceive();
  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const extraspot = this.props.extraspot || {};
    const purchaseRequest = this.props.purchaseRequest || [];
    const {
      silverLeft,
      goldLeft,
      selectedRequest
    } = this.state;
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="right_col" role="main">
        <br/>
          <form onSubmit={this.handleSubmit.bind(this)}action="#" method="POST" id="updateMultiplier" role="form">
            <legend>Set Multiplier</legend>
            <div className="form-group">
              <label htmlFor="multiplier">GoldDollar Multiplier</label>
              <input type="number" defaultValue={extraspot.multiplier} required className="form-control" id="multiplier" name="multiplier" placeholder="GoldDollars Multiplier" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" defaultValue={''} required className="form-control" id="password" name="password" placeholder="Password" />
            </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
        <br/>
        <div className="">
          <div className="message_wrapper">
              <h4 className="heading">Manage Purchase Request</h4>
          </div>
          <div className="message_wrapper pull-right">
              <h4 className="heading">Available Amount(ounces)</h4>
              <h4 className="heading">Gold : {goldLeft}</h4>
              <h4 className="heading">Silver: {silverLeft}</h4>
          </div>
          <div>
              <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
          </div>
      <div className="row" >
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="panel panel-default">
              <div className="panel-heading">
                  Purchase Requests <span className="pull-right"></span>
              </div>
              <div className="panel-body">
              <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                      <thead>
                          <tr>
                              <th>User Name</th>
                              <th>US Dollar</th>
                              <th>Gold/Silver(Ounce)</th>
                              <th style={{textAlign:'center'}}>Price of Gold/Silver<br/>at Time of Purchase</th>
                              <th>Request Time</th>
                              <th>Accept/Reject Request</th>
                          </tr>
                      </thead>
                      <tbody>
                        {
                          purchaseRequest.map(pr=>{
                            let gold = parseFloat(pr.price).toFixed(2);
                            let usdAmount = parseFloat(parseFloat(pr.amount) * gold).toFixed(2);
                            let ounce = parseFloat(pr.amount).toFixed(5);
                            return (
                              <tr key={pr._id}>
                                  <td onClick={()=>{
                                      this.setState({
                                        selectedRequest: pr
                                      })
                                    }} className="getUsers pointer" data-toggle="modal" href='#userDetails'>{pr.name}</td>
                                  <td>{usdAmount}</td>
                                  <td>{ounce} {pr.membership}</td>
                                  <td>{parseFloat(pr.price).toFixed(2)}</td>
                                  <td>{moment(pr.createdAt).format('LLL')}</td>
                                <td>
                                  <a onClick={()=>{
                                    if (parseFloat(this.state.goldLeft) < ounce) {
                                      NotificationManager.error('Request Amount is more than Available Amount. Please Add Required Amount to Vault');
                                      return false;
                                    } else {
                                      Meteor.call('purchaseMeGold', pr.userId, pr.membership, pr.amount, pr.price, pr.container, pr._id, function(error, result) {
                                       if (result) {
                                        NotificationManager.success("Amount Successfully added to Users Account")
                                       Meteor.call('leftAmount', "gold", function(error, result) {
                                         self.setState({
                                           goldLeft: result
                                         })
                                       });
                                       Meteor.call('leftAmount', "silver", function(error, result) {
                                         self.setState({
                                           silverLeft: result
                                         })
                                       });
                                     } else {
                                        NotificationManager.error(error.reason);
                                     }
                                   });
                                  }
                                }} href="#" id="accept" className="btn btn-sm btn-success">Accept</a>
                              <a onClick={()=>{
                              Meteor.call('rejectPurchaseRequest', pr, pr._id, function(error, result) {
                                if (result) {
                                  NotificationManager.success("Purchase Request is successfully Rejected")
                                } else {
                                  NotificationManager.error(error.reason)
                                }
                              });
                            }} href='#' id="reject" className="btn btn-sm btn-danger">Reject</a>
                              </td>
                            </tr>
                            )
                          })
                        }
                        {
                          purchaseRequest.length === 0?
                          <tr>
                              <td colSpan="6" className="text-center">No Purchase Request</td>
                          </tr>
                          :null
                        }
                      </tbody>
                  </table>
                </div>
              </div>
          </div>
      </div>
  </div>
      </div>
    </div>
    <Modal
        show={Boolean(selectedRequest._id)}
        onHide={this.closeModal}
        aria-labelledby="userDetail"
      >
      <Modal.Header closeButton>
        <h4 className="modal-title">User Details: {selectedRequest.name}</h4>
      </Modal.Header>
      <Modal.Body style={{height:'70vh'}}>
          <table className="table table-bordered table-hover table-responsive">
              <tbody>
                  <tr>
                      <td>Full Name</td>
                      <td>{selectedRequest.name}</td>
                  </tr>
                  <tr>
                      <td>Email</td>
                      <td>{selectedRequest.email}</td>
                  </tr>
                  <tr>
                      <td>Address</td>
                      <td>{selectedRequest.address}</td>
                  </tr>
                  <tr>
                      <td>Phone</td>
                      <td>{selectedRequest.phone}</td>
                  </tr>
              </tbody>
          </table>
      </Modal.Body>
    </Modal>
  </section>
    )
  }
}

const PurchaseRequestContainer = withTracker((props)=>{
  Meteor.subscribe('Multiplier');
  Meteor.subscribe("purchaseRequest");
  return {
    extraspot: ExtraSpot.findOne(),
    purchaseRequest: PurchaseRequest.find().fetch(),
    gold: Gold.findOne()
  }
})(PurchaseRequests);


function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseRequestContainer)

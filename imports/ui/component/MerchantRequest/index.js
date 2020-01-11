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
import { Distributor } from '../../../collections/Distributor';
import { Gold } from '../../../collections/Gold';

import UTILS from '../../../util'

class MerchantRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      merchantRequest: []
    }
  }
  handleSubmit(i, e) {
    e.preventDefault();
    const self = this;
    let percent = e.target.percent.value;
    let userId = e.target.userId.value;
    self.setState({loading: true});
    const merchantRequest = JSON.parse(JSON.stringify(this.state.merchantRequest)) || [];
    Meteor.call('setMerchant', userId, true, percent, function(error, result) {
       if (!error) {
         NotificationManager.success('Successfully Updated');
         self.props.history.push('/merchant-request');
         merchantRequest.splice(i, 1);
         self.setState({
           merchantRequest
         })
       } else {
         NotificationManager.error('Something went wrong. Please try again');
       }
   });

  }
  componentWillMount() {
    const self = this;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    Meteor.call('getMerchantRequestUser', function(error, result) {
        self.setState({
          merchantRequest: result
        })
    });

  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const {merchantRequest} = this.state;
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="right_col" role="main">
    <br/>
    <div className="">
        <div className="message_wrapper">
            <h4 className="heading">Manage Merchant Request</h4>
        </div>
        <div>
            <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="panel panel-default">
          <div className="panel-heading">
              Merchant Requests <span className="pull-right"></span>
          </div>
          <div className="panel-body">
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Manage Request</th>
                        </tr>
                    </thead>
                    <tbody>
                      {
                        merchantRequest.map((m, i)=>{
                          return (
                            <tr key={m._id}>
                              <td>{m.email}</td>
                              <td>{m.fullname}</td>
                              <td>{m.phone}</td>
                              <td>{m.address}</td>
                                <td>
                                  <form onSubmit={this.handleSubmit.bind(this, i)}>
                                  <input type="hidden" name="userId" defaultValue={m.userId} />
                                  <input type="number" autoFocus id="percent" name="percent" step="1" className="form-control" defaultValue="2" required max="100" min="0" title="percent" placeholder="Percentage Fees" />
                                  <br />
                                  <button type="submit" id="accept" className="btn btn-sm btn-success">Accept</button>
                                  <br/><br/>
                                  <a href="#" id="reject" onClick={()=>{
                                    Meteor.call('setMerchant',m.userId,false,0,function (error, result) {
                                        if(!error){
                                          NotificationManager.success('Successfully Updated');
                                          self.props.history.push('/merchant-request');
                                          merchantRequest.splice(i, 1)
                                          self.setState({
                                            merchantRequest
                                          })
                                        } else {
                                          NotificationManager.error('Something went wrong. Please try again');
                                        }
                                    });
                                  }} className="btn btn-danger btn-sm">Reject</a>
                                  </form>
                                </td>
                            </tr>
                          )
                        })
                      }
                      {
                        merchantRequest.length === 0 ?
                        <tr>
                          <td colSpan="5" className="text-center">No Users Apply for Merchant Account</td>
                        </tr>
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
    </div>
  </div>
</section>
    )
  }
}

const MerchantRequestContainer = withTracker((props)=>{
  return {
    gold: Gold.findOne()
  }
})(MerchantRequest);


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

export default connect(mapStateToProps, mapDispatchToProps)(MerchantRequestContainer)

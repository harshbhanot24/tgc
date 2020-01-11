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

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userMonthCharges: 200,
      merchantMonthlyCharges: 600,
      userList: [],
      selectedUser: {},
      total: 20
    }
    this.closeModal = this.closeModal.bind(this)
  }
  closeModal() {
    this.setState({
      selectedUser: {}
    })
  }
  handleChargeSubmit(e) {
    e.preventDefault();
    let userMonthCharges = e.target.userMonthCharges.value;
    let merchantMonthlyCharges = e.target.merchantMonthlyCharges.value;
    Meteor.call('updateCharges', userMonthCharges, merchantMonthlyCharges, (err, res)=> {
      if (res) {
        self.setState({
          userMonthCharges,
          merchantMonthlyCharges
        });
        NotificationManager.success('Updated Successfully','',3000);
      } else {
        NotificationManager.error(err.reason,'',3000);
      }
  });
  }
  componentWillMount() {
    const self = this;
    Meteor.call('getUserMerchantCharges',(err,res)=>{
      self.setState({
          userMonthCharges: res[0],
          merchantMonthlyCharges: res[1]
      })
    })
    Meteor.call('getAllUsersDetail',0, 20, function(err,res) {
      if(!err) {
        self.setState({
          userList: res
        })
      } else {
        NotificationManager.error(err.reason, '',3000);
      }
    })
    Meteor.call('getTotalDB', 'Meteor.users', (err,res)=>{
      self.setState({
        total: res
      })
    })
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // Meteor.subscribe('balance');
    // this.props.getTodayTJSent();
    // this.props.getTodayTJReceive();
  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { money, profile, gold, user} = this.props;
    const { selectedUser } = this.state;
    const params = this.props.match.params;
    const page = params.page || 1;
    const total = this.state.total || 20;
    const maxPage = Math.ceil(total/20);
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="right_col user_col" role="main">
        <br/>
        <div className="">
          <div className="message_wrapper">
              <h4 className="heading">Manage Users</h4>
          </div>
          <div>
            <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
          </div>
          <Link to="/create-user" className="btn btn-default btn-lg input-lg" id="CreateUser">
            <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Create New User
          </Link>
          <div className="table-responsive">
            <br/><br/>
            <form action="#" onSubmit={this.handleChargeSubmit.bind(this)} id="updateCharges" role="form">
              <legend>Set Monthly Charges</legend>
              <div className="form-group">
                  <label htmlFor="subject">Users (GoldDollars)</label>
                  <input type="number" defaultValue={this.state.userMonthCharges} required className="form-control" id="user" name="userMonthCharges" placeholder="Users GoldDollars Charges" />
              </div>
              <div className="form-group">
                  <label htmlFor="subject">Merchant(GoldDollars)</label>
                  <input type="text" required className="form-control" defaultValue={this.state.merchantMonthlyCharges} id="merchant" name="merchantMonthlyCharges" placeholder="Merchant GoldDollars Charges" />
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
            </form>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Card Number(Gold)</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>isMerchant</th>
                    </tr>
                </thead>
                <tbody>
                  {
                    this.state.userList.map(user=>{
                      return (
                        <tr key={user._id} className='pointer'>
                            <td>{user.cards}</td>
                            <td><a href="#" onClick={()=>{
                                self.setState({
                                  selectedUser: user
                                })
                              }} className="getUsers">{user.fullname}</a></td>
                            <td>{user.email}</td>
                            <td>{user.merchant?"Yes":"No"}</td>
                            <td><Link to={"/manage-users/"+user.userId} id="openUserDetails" className="btn btn-primary btn-sm">View Details</Link></td>
                        </tr>
                      )
                    })
                  }
                  {
                    this.state.userList.length === 0?
                      <tr>
                          <td colSpan="4">No User Register Yet</td>
                      </tr>
                    :
                      null
                  }
                </tbody>
            </table>
            {
              this.state.userList.length !== 0 ?
                <ul className="pagination pagination-lg">
                {
                  [...Array(maxPage)].map((i,d)=>{
                    return (
                      <li className={page === (d+1)?'active':''} key={d+2}>
                        <Link to={"manage-users/"+(d+1)}>{d+1}</Link>
                      </li>
                    )
                  })
                }
                </ul>
              :
                null
            }
          </div>
        </div>
        <Modal
            show={Boolean(selectedUser._id)}
            onHide={this.closeModal}
            aria-labelledby="PrivacyPolicy"
          >
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{height:'70vh'}}>
            <table className="table table-bordered table-hover table-responsive">
                <tbody>
                    <tr>
                        <td>Full Name</td>
                        <td>{selectedUser.fullname}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{selectedUser.email}</td>
                    </tr>
                    <tr>
                        <td>Address</td>
                        <td>{selectedUser.address}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>{selectedUser.phone}</td>
                    </tr>
                    <tr>
                        <td>DOB</td>
                        <td>{selectedUser.dob}</td>
                    </tr>
                </tbody>
            </table>
          </Modal.Body>
        </Modal>
      </div>
    </section>
    )
  }
}

const UsersContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne(),
    gold: Gold.findOne()
  }
})(Users);


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

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer)

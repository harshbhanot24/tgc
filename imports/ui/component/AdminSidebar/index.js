import React from 'react';
import {
  Meteor
} from 'meteor/meteor';
import { Scrollbars } from 'react-custom-scrollbars';
import { NotificationContainer } from "react-notifications";
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router'

import { logoutUser } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import { Gold } from '../../../collections/Gold';
import { Silver } from '../../../collections/Silver';

class AdminSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      merchantRequestCount: 0,
      purchaseRequestCount: 0
    }
  }
  componentWillMount() {
    const self = this;
    Meteor.call('getPurchaseMerchantRequestCount',function(err,res){
      if(!err)
        self.setState({
          merchantRequestCount: res[0],
          purchaseRequestCount: res[1]
        })
    })
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.user && !nextProps.user) {
      nextProps.history.push('/');
      this.props.logoutUser();
    }
  }
  render() {
    const {location:{pathname}, user,gold,silver} = this.props;
    const {merchantRequestCount, purchaseRequestCount} = this.state;
    let staff = user && user.profile.staff;
    let admin = user && user.profile.admin;
    return (
      <aside>
      <div id="sidebar" className="nav-collapse ">
        <Scrollbars style={{ flex: "1 1 0" }}>
        <ul className="sidebar-menu">
          <li className="active">
            <Link to='/' className="">
              <i className="fa fa-dashboard"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          {
            staff ?
            [
              <li key='addShip' className="">
                <Link to='/addShipment' className="" >
                  <i className="fa fa-folder-o"></i>
                  <span>Add Shipment</span>
                </Link>
              </li>,
              <li key="movetovault" className="">
                <Link to="/move-to-vault" className="" >
                  <i className="fa fa-folder-o"></i>
                  <span>Move to Vault</span>
                </Link>
              </li>,
              <li key="revT" className="">
                <Link to="/reverse-transaction" className="" >
                  <i className="fa fa-money"></i>
                  <span>Reverse Transaction</span>
                </Link>
              </li>,

            ]
            :
            null
          }
          {
            admin ?
            <React.Fragment>
              <li className="">
                <Link to="/manage-users">
                  <i className="fa fa-users"></i>
                  <span>Users</span>
                </Link>
              </li>
              <li className="">
                <Link to="/email-all">
                  <i className="fa fa-envelope-o"></i>
                  <span>Email (all)</span>
                </Link>
              </li>
              <li className="">
                <Link to="/purchase-request">
                  <i className="fa fa-envelope-o"></i>
                  <span>Purchase Request <span className="badge">{purchaseRequestCount}</span></span>
                </Link>
              </li>
              <li className="">
                <Link to="/merchant-request">
                  <i className="fa fa-envelope-o"></i>
                  <span>Merchant Request <span className="badge">{merchantRequestCount}</span></span>
                </Link>
              </li>
              <li className="">
                <Link to="/track-gold">
                  <i className="fa fa-money"></i>
                  <span>Track Gold/Silver</span>
                </Link>
              </li>
              <li className="">
                <Link to="/manage-staff">
                  <i className="fa fa-user"></i>
                  <span>Manage Staff</span>
                </Link>
              </li>
              <li className="">
                <Link to="/view-db">
                  <i className="fa fa-th"></i>
                  <span>View Database</span>
                </Link>
              </li>
              <li className="">
                <Link to="/export-db">
                  <i className="fa fa-th"></i>
                  <span>Export Data(CSV)</span>
                </Link>
              </li>
              <li className="">
                <Link to="/distributor">
                  <i className="fa fa-user"></i>
                  <span>Manage Distributor</span>
                </Link>
              </li>

            </React.Fragment>
            :
            null
          }
          <li className="">
            <Link to="/change-password">
              <i className="fa fa-user-secret"></i>
              <span>Change Password</span>
            </Link>
          </li>

        </ul>
        </Scrollbars>
      </div>
    </aside>
    )
  }
}

const NavbarContainer = withTracker((props)=>{
  return {
    gold: Gold.findOne(),
    silver: Silver.findOne(),
    profile: Profile.findOne(),
    user: Meteor.user()
  }
})(AdminSidebar);

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: ()=> dispatch(logoutUser())
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavbarContainer))

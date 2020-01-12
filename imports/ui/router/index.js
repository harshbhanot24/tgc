import React from "react";
import { bindActionCreators } from "redux";
import { withTracker } from "meteor/react-meteor-data";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import { Switch, Route } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import {
  loginSuccess,
  getTransaction,
  getTodayTJSent,
  getTodayTJReceive
} from "../../actions/login";

import Home from "../component/Home";
import Login from "../component/Login";
import Alert from "../component/Alert";
import Register from "../component/Register";
import NotFound from "../component/NotFound";
import UserDashboard from "../component/Dashboard";
import StaffDashboard from "../component/StaffDashboard";
import Cards from "../component/Cards";
import ResetPin from "../component/ResetPin";
import AddShipment from "../component/AddShipment";
import Buy from "../component/Buy";
import Send from "../component/Send";
import Profile from "../component/Profile";
import SingleTransaction from "../component/SingleTransaction";
import Transaction from "../component/Transaction";
import Forgot from "../component/Forgot";
import ResetPassword from "../component/ResetPassword";
import AppLayout from "../layouts/AppLayout";
import AdminLayout from "../layouts/AdminLayout";
import MoveToVault from "../component/MoveToVault";
import ReverseTransaction from "../component/ReverseTransaction";
import Users from "../component/Users";
import ChangePassword from "../component/ChangePassword";
import AdminDashboard from "../component/AdminDashboard";
import UserDetail from "../component/UserDetail";
import AddUser from "../component/AddUser";
import EmailAll from "../component/EmailAll";
import ManageDistributor from "../component/ManageDistributor";
import PurchaseRequest from "../component/PurchaseRequest";
import ManageStaff from "../component/ManageStaff";
import CreateStaff from "../component/CreateStaff";
import MerchantRequest from "../component/MerchantRequest";
import StaffDetail from "../component/StaffDetail";
import ViewDB from "../component/ViewDB";
import ExportDB from "../component/ExportDB";
import BlockChain from "../component/BlockChain";
import UserBlockChain from "../component/UserBlockChain";
import ViewDBDetails from "../component/ViewDBDetails";

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    if (Meteor.userId() && !this.props.user.role) {
      this.props.loginSuccess();
    }
    if (Meteor.userId() && this.props.user.role === "user") {
      Meteor.subscribe("profile");
      Meteor.subscribe("Multiplier");
      Meteor.subscribe("balance");
      Meteor.subscribe("RecentTransferUser");
      this.props.getTodayTJSent();
      this.props.getTodayTJReceive();
      this.props.getTransaction();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (Meteor.userId() && !this.props.user.role) {
      this.props.loginSuccess();
    }
    if (
      !this.props.user.userId &&
      nextProps.user.userId &&
      Meteor.userId() &&
      nextProps.user.role === "user"
    ) {
      Meteor.subscribe("profile");
      Meteor.subscribe("Multiplier");
      Meteor.subscribe("balance");
      Meteor.subscribe("RecentTransferUser");
      this.props.getTodayTJSent();
      this.props.getTodayTJReceive();
      this.props.getTransaction();
    }
  }
  render() {
    const {
      mUser,
      user: { role }
    } = this.props;
    const self = this;
    let staff = mUser && mUser.profile.staff;
    if (!mUser) {
      return (
        <AppLayout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forgot" component={Forgot} />
            <Route exact path="/reset/:token" component={ResetPassword} />
            <Route
              exact
              path="/register/success"
              render={props => {
                if (
                  !self.props.register.inProgress &&
                  self.props.register.successMessage
                ) {
                  return (
                    <Alert
                      title="Successfully Registered"
                      message={self.props.register.successMessage}
                      type="success"
                    />
                  );
                } else {
                  props.history.push("/");
                }
              }}
            />
            <Route
              exact
              path="/verify/:token"
              render={props => {
                const token = props.match.params.token;
                if (!token) props.history.push("/");
                Accounts.verifyEmail(token, function(err) {
                  if (err) {
                    NotificationManager.error(err.reason, "", 5000);
                    props.history.push("/");
                  } else {
                    NotificationManager.success(
                      "Email verified Successfully",
                      "",
                      5000
                    );
                    self.props.loginSuccess();
                    props.history.push("/");
                  }
                });
                return (
                  <Alert
                    title="Email Verification"
                    message="Please wait..."
                    type="info"
                  />
                );
              }}
            />
            <Route component={Home} />
          </Switch>
        </AppLayout>
      );
    } else if (role === "admin") {
      return (
        <AdminLayout>
          <Switch>
            <Route exact path="/" component={AdminDashboard} />
            <Route exact path="/manage-users/:page?" component={Users} />
            <Route exact path="/manage-users/:userId" component={UserDetail} />
            <Route exact path="/create-user" component={AddUser} />
            <Route exact path="/email-all" component={EmailAll} />
            <Route exact path="/distributor" component={ManageDistributor} />
            <Route exact path="/purchase-request" component={PurchaseRequest} />
            <Route exact path="/merchant-request" component={MerchantRequest} />
            <Route exact path="/manage-staff" component={ManageStaff} />
            <Route exact path="/manage-staff/:userId" component={StaffDetail} />
            <Route exact path="/create-staff" component={CreateStaff} />
            <Route exact path="/view-db" component={ViewDB} />
            <Route exact path="/export-db" component={ExportDB} />
            <Route exact path="/track-gold" component={BlockChain} />
            <Route
              exact
              path="/track-gold/:userId"
              component={UserBlockChain}
            />
            <Route exact path="/view-db/:db/:page?" component={ViewDBDetails} />
            <Route exact path="/change-password" component={ChangePassword} />
            <Route
              exact
              path="/login"
              render={props => {
                props.history.push("/");
                return null;
              }}
            />
          </Switch>
        </AdminLayout>
      );
    } else if (staff) {
      return (
        <AdminLayout>
          <Switch>
            <Route exact path="/" component={StaffDashboard} />
            <Route exact path="/addShipment" component={AddShipment} />
            <Route exact path="/move-to-vault" component={MoveToVault} />
            <Route exact path="/change-password" component={ChangePassword} />
            <Route
              exact
              path="/reverse-transaction"
              component={ReverseTransaction}
            />
            <Route
              exact
              path="/login"
              render={props => {
                props.history.push("/");
                return null;
              }}
            />
          </Switch>
        </AdminLayout>
      );
    } else if (mUser) {
      return (
        <AppLayout>
          <Switch>
            <Route exact path="/" component={UserDashboard} />
            <Route exact path="/cards" component={Cards} />
            <Route exact path="/reset-pin" component={ResetPin} />
            <Route exact path="/buy" component={Buy} />
            <Route exact path="/send" component={Send} />
            <Route exact path="/profile" component={Profile} />
            <Route
              exact
              path="/transaction/:tId"
              component={SingleTransaction}
            />
            <Route exact path="/transaction" component={Transaction} />
            <Route component={UserDashboard} />
            <Route
              exact
              path="/login"
              render={props => {
                props.history.push("/");
                return null;
              }}
            />
          </Switch>
        </AppLayout>
      );
    }
  }
}

const RouterContainer = withTracker(props => {
  return {
    mUser: Meteor.user()
  };
})(Router);

function mapStateToProps(state) {
  return {
    user: state.user,
    register: state.register
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginSuccess: () => dispatch(loginSuccess()),
    getTodayTJSent: () => dispatch(getTodayTJSent()),
    getTransaction: () => dispatch(getTransaction()),
    getTodayTJReceive: () => dispatch(getTodayTJReceive())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterContainer);

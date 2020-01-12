import React from "react";
import { Meteor } from "meteor/meteor";
import { NotificationContainer } from "react-notifications";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router";

import { logoutUser } from "../../../actions/login";
import { Profile } from "../../../collections/Profile";
import { Gold } from "../../../collections/Gold";
import { Silver } from "../../../collections/Silver";

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.user && !nextProps.user) {
      nextProps.history.push("/");
      this.props.logoutUser();
      Meteor.logout();
    }
  }
  render() {
    const {
      location: { pathname },
      user,
      gold,
      silver
    } = this.props;
    let email = "";
    let userId = "";
    if (user && user._id) {
      userId = user._id;
      email = user.username;
    }
    const goldValue = gold ? parseFloat(gold.data).toFixed(2) : "";
    const silverValue = silver ? parseFloat(silver.data).toFixed(2) : "";
    return (
      <header className="header dark-bg">
        <div className="toggle-nav">
          <div
            className="icon-reorder tooltips"
            data-original-title="Toggle Navigation"
            data-placement="bottom"
          >
            <i className="icon_menu"></i>
          </div>
        </div>
        <img
          src="/img/logo43.png"
          className="img-circle"
          style={{ marginLeft: "15px", marginTop: "5px" }}
          height="43"
          width="76"
        />
        <div className="top-nav notification-row">
          <ul className="nav pull-right top-menu">
            <li className="dropdown">
              <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                <span className="profile-ava" style={{ marginRight: "8px" }}>
                  <img alt="" height="30" width="30" src="/img/user.png" />
                </span>
                <span className="username">Admin</span>
                <b className="caret"></b>
              </a>
              <ul className="dropdown-menu extended logout">
                <div className="log-arrow-up"></div>
                <li
                  onClick={() => {
                    this.props.logoutUser();
                    Meteor.logout();
                  }}
                >
                  <Link to="/">
                    <i className="icon_key_alt"></i> Log Out
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </header>
    );
  }
}

const NavbarContainer = withTracker(props => {
  return {
    gold: Gold.findOne(),
    silver: Silver.findOne(),
    profile: Profile.findOne(),
    user: Meteor.user()
  };
})(AdminNavbar);

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser())
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavbarContainer)
);

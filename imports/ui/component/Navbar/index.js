import React from "react";
import { Meteor } from "meteor/meteor";
import { NotificationContainer } from "react-notifications";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router";
import moment from "moment";
import { logoutUser } from "../../../actions/login";
import { Profile } from "../../../collections/Profile";
import { Gold } from "../../../collections/Gold";
import { Silver } from "../../../collections/Silver";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.user && !nextProps.user) {
      nextProps.history.push("/");
      this.props.logoutUser();
    }
  }
  isActive = path => {
    const {
      location: { pathname }
    } = this.props;
    if (pathname === path) {
      return "kt-menu__item  kt-menu__item--active";
    }
    return "kt-menu__item";
  };
  render() {
    const {
      location: { pathname },
      user,
      gold,
      silver,
     profile={}
    } = this.props;
    let email = "";
    let userId = "";
    const {fullname=null}=profile;
    if (user && user._id) {
      userId = user._id;
      email = user.username;
    }
    const goldValue = gold ? parseFloat(gold.data).toFixed(2) : "";
    const silverValue = silver ? parseFloat(silver.data).toFixed(2) : "";
    const style = {
      border: {
        border: "1px solid"
      },
      backgroundImage: {
        backgroundImage: `url("assets/media/misc/bg-1.jpg")`
      }
    };

    return (
      <>
        <div
          id="kt_header_mobile"
          className="kt-header-mobile  kt-header-mobile--fixed "
        >
          <div className="kt-header-mobile__logo">
            <a href="index.html">
              <img alt="Logo" src="assets/media/logos/logo-6-sm.png" />
            </a>
          </div>
          <div className="kt-header-mobile__toolbar">
            <div
              className="kt-header-mobile__toolbar-toggler kt-header-mobile__toolbar-toggler--left"
              id="kt_aside_mobile_toggler"
            >
              <span></span>
            </div>
            <div
              className="kt-header-mobile__toolbar-toggler"
              id="kt_header_mobile_toggler"
            >
              <span></span>
            </div>
            <div
              className="kt-header-mobile__toolbar-topbar-toggler"
              id="kt_header_mobile_topbar_toggler"
            >
              <i className="flaticon-more"></i>
            </div>
          </div>
        </div>
        <div className="kt-grid kt-grid--hor kt-grid--root">
          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
            <div
              className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper"
              id="kt_wrapper"
            >
              <div
                id="kt_header"
                className="kt-header kt-grid kt-grid--ver  kt-header--fixed "
              >
                <div
                  className="kt-header__brand kt-grid__item  "
                  id="kt_header_brand"
                >
                  <div className="kt-header__brand-logo">
                    <a href="index.html">
                      <img alt="Logo" src="assets/media/logos/logo-6.png" />
                    </a>
                  </div>
                </div>

                <h3 className="kt-header__title kt-grid__item">Dashboard</h3>

                <button
                  className="kt-header-menu-wrapper-close"
                  id="kt_header_menu_mobile_close_btn"
                >
                  <i className="la la-close"></i>
                </button>
                <div
                  className="kt-header-menu-wrapper kt-grid__item kt-grid__item--fluid"
                  id="kt_header_menu_wrapper"
                >
                  <div
                    id="kt_header_menu"
                    className="kt-header-menu kt-header-menu-mobile  kt-header-menu--layout-default "
                  >
                    <ul className="kt-menu__nav ">
                      <li className={this.isActive("/")} aria-haspopup="true">
                        <Link to="/" className="kt-menu__link ">
                          <span className="kt-menu__link-text">Home</span>
                        </Link>
                      </li>
                      <li
                        className={this.isActive("/cards")}
                        aria-haspopup="true"
                      >
                        <Link to="/cards" className="kt-menu__link ">
                          <span className="kt-menu__link-text">Cards</span>
                          <i className="kt-menu__hor-arrow la la-money"></i>
                        </Link>
                      </li>
                      <li
                        className={this.isActive("/buy")}
                        aria-haspopup="true"
                      >
                        <Link to="/buy" className="kt-menu__link ">
                          <span className="kt-menu__link-text">Buy Gold</span>
                          <i className="kt-menu__hor-arrow la la-cart-plus"></i>
                        </Link>
                      </li>
                      <li
                        className={this.isActive("/send")}
                        aria-haspopup="true"
                      >
                        <Link to="/send" className="kt-menu__link ">
                          <span className="kt-menu__link-text">
                            Transfer
                          </span>
                          <i className="kt-menu__hor-arrow la la-exchange"></i>
                        </Link>
                      </li>
                      <li className="kt-menu__item" aria-haspopup="true">
                        <a style={style.border} className="kt-menu__link ">
                          <span className="kt-menu__link-text">
                            <b>
                              {goldValue ? "Gold: $" + goldValue + " | " : ""}
                              {silverValue ? "Silver: $" + silverValue : ""}
                            </b>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="kt-header__topbar">
                  <div className="kt-header__topbar-item kt-header__topbar-item--user">
                    <div
                      className="kt-header__topbar-wrapper"
                      data-toggle="dropdown"
                      data-offset="10px,0px"
                    >
                      <span className="kt-hidden kt-header__topbar-welcome">
                        Hi,
                      </span>
                      <span className="kt-hidden kt-header__topbar-username">
                        {fullname}
                      </span>
                      <img
                        className="kt-hidden"
                        alt="Pic"
                        src="assets/media/users/300_21.jpg"
                      />
                      <span className="kt-header__topbar-icon kt-hidden-">
                        <i className="flaticon2-user-outline-symbol"></i>
                      </span>
                    </div>
                    <div className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">
                      <div
                        className="kt-user-card kt-user-card--skin-dark kt-notification-item-padding-x"
                        style={style.backgroundImage}
                      >
                        <div className="kt-user-card__avatar">
                          <img
                            className="kt-hidden"
                            alt="Pic"
                            src="/assets/media/users/300_25.jpg"
                          />

                          <span className="kt-badge kt-badge--lg kt-badge--rounded kt-badge--bold kt-font-success">
                            {fullname ? fullname.charAt(0).toUpperCase() : null}
                          </span>
                        </div>
                        <div className="kt-user-card__name">{fullname}</div>
                      </div>

                      <div className="kt-notification">
                        <Link to="/profile" className="kt-notification__item">
                          <div className="kt-notification__item-icon">
                            <i className="flaticon2-calendar-3 kt-font-success"></i>
                          </div>
                          <div className="kt-notification__item-details">
                            <div className="kt-notification__item-title kt-font-bold">
                              My Profile
                            </div>
                            <div className="kt-notification__item-time">
                              Payment settings and more
                            </div>
                          </div>
                        </Link>

                        <div className="kt-notification__custom">
                          <Link
                            to="/"
                            className="btn btn-label-brand btn-sm btn-bold"
                            onClick={() => {
                              this.props.logoutUser();
                            }}
                          >
                            Sign Out
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const NavbarContainer = withTracker(props => {
  Meteor.subscribe("Gold");
  Meteor.subscribe("Silver");
  Meteor.subscribe("profile");
  return {
    gold: Gold.findOne(),
    silver: Silver.findOne(),
    profile: Profile.findOne(),
    user: Meteor.user()
  };
})(Navbar);

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser())
    // fetchPokemon: bindActionCreators(fetchPokemon, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavbarContainer)
);

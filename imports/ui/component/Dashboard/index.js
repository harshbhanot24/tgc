import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { login } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import { ExtraSpot } from '../../../collections/ExtraSpot';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';
import Reusabletable from "../utils/table";
// import { getTodayTJSent, getTodayTJReceive } from '../../../actions/login';

import UTILS from '../../../util'

import './style.scss';
import GoldData from '../goldData';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  products = [];
  formatDate = (cell, row) => {
    console.log("formatDatecell: ", cell);
    return moment(cell).format("LLL");
  };

  formatFrom = (cell, row) => {
    console.log("cell: ", cell);
    return (
      <span>{`${cell.FromName}(${cell.FromCard}) sent ${cell.Fromgold}`}</span>
    );
  };
  formatTo = (cell, row) => {
    console.log("cell: ", cell);
    return (
      <span>
        {`${cell.ToName}(${cell.ToCard}) received ${cell.Togold}`}
      </span>
    );
  };
  columns = [
    {
      dataField: "data",
      text: "From",
      formatter: this.formatFrom
    },
    {
      dataField: "data",
      text: "To",
      formatter: this.formatTo
    },
    {
      dataField: "data._id",
      text: "TransactionID"
    },
    {
      dataField: "data.Date",
      text: "Date",
      formatter: this.formatDate
    }
  ];
  componentDidMount() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // Meteor.subscribe('profile');
    // Meteor.subscribe('balance');
    // this.props.getTodayTJSent();
    // this.props.getTodayTJReceive();
  }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.profile && !nextProps.profile.fullname) {
  //     nextProps.history.push('/profile');
  //   }
  // }
  handleLogin(e) {
    e.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    this.props.login({
      email,
      password
    });
  }
  render() {
    const { money, profile, extraSpot, gold, user } = this.props;
    const transaction = [
      {
        data: {
          FromName: "harsh",
          FromCard: "ROndsafRam",
          Fromgold: "gold form",
          ToName: "fdsaf",
          ToCard: "dsafasd",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 132
        }
      },

      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },
      {
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      },{
        data: {
          FromName: "harsh",
          FromCard: "RAJ",
          Fromgold: "gold form",
          ToName: "harsh",
          ToCard: "dsafsda",
          Togold: "gold form",
          Date: "01-12-1998",
          _id: 13233
        }
      }
    ];
    let userGold = "";
    if (money) userGold = parseFloat(money.gold);
    const goldValue = gold ? parseFloat(gold.data) : "";
    let getTJBalanceUSD;
    if (goldValue && userGold !== "" && extraSpot) {
      const totalTJ = userGold * goldValue * extraSpot.multiplier;
      getTJBalanceUSD = UTILS.currencyFormat(parseFloat(totalTJ).toFixed(2));
    }
    const todayTJSent = user.todayTJSent;
    const todayTJReceive = user.todayTJReceive;
    return (
      <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
        <div
          className="kt-content  kt-grid__item kt-grid__item--fluid"
          id="kt_content"
        >
          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8 col-md-8 col-sm-12">
              <GoldData
                userGold={userGold}
                getTJBalanceUSD={getTJBalanceUSD}
                todayTJSent={todayTJSent}
                todayTJReceive={todayTJReceive}
              />
              <div className="kt-portlet kt-portlet--mobile">
                <div className="kt-portlet__head kt-portlet__head--lg">
                  <div className="kt-portlet__head-label">
                    <span className="kt-portlet__head-icon">
                      <i className="kt-font-brand flaticon2-line-chart"></i>
                    </span>
                    <h3 className="kt-portlet__head-title">Transactions</h3>
                  </div>
                  <div className="kt-portlet__head-toolbar">
                    <div className="kt-portlet__head-wrapper">
                      <div className="kt-portlet__head-actions">
                        <Link
                           to="/transaction"
                          className="btn btn-brand btn-elevate btn-icon-sm"
                        >
                          <i className="la la-file-image-o"></i>
                          Transaction Statements
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kt-portlet__body kt-portlet__body--fit">
                  <Reusabletable
                    keyField="_id"
                    data={transaction}
                    columns={this.columns}
                  ></Reusabletable>
                </div>
              </div>
            </div>
            <div className="col-lg-2"></div>
          </div>
        </div>
      </div>
    );
  }
}

const DashboardContainer = withTracker((props) => {
  Meteor.subscribe('Gold')
  Meteor.subscribe('Silver')
  Meteor.subscribe('Multiplier');
  Meteor.subscribe('profile');
  Meteor.subscribe('balance');
  return {
    profile: Profile.findOne(),
    money: Money.findOne(),
    extraSpot: ExtraSpot.findOne(),
    gold: Gold.findOne()
  }
})(Dashboard);


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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer)

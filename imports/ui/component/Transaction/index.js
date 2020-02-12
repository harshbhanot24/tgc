import React from "react";
import { Meteor } from "meteor/meteor";
import FileSaver from "file-saver";
import converter from "json-2-csv";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import DatePicker from "react-16-bootstrap-date-picker";
import { login } from "../../../actions/login";
import { Profile } from "../../../collections/Profile";
import { ExtraSpot } from "../../../collections/ExtraSpot";
import { Money } from "../../../collections/Money";
import { Gold } from "../../../collections/Gold";
import { emailSubscribe, emailUnsubscribe } from "../../../actions/profile";
import Reusabletable from "../utils/table";

import UTILS from "../../../util";

import "./style.scss";

const prepareData = function(transactions) {
  return transactions.map(transaction => {
    return {
      TransactionID: transaction._id,
      From: `${transaction.FromName}(${transaction.FromCard}) sent ${transaction.Fromgold} (Gold Dollar)`,
      To: `${transaction.ToName || "unknown"} (${
        transaction.ToCard
      }) received ${transaction.Togold} (Gold Dollar)`,
      Date: moment(transaction.Date).format("LLL"),
      remarks: transaction.remarks
    };
  });
};
const preparePDFRow = function(transactions) {
  return transactions.map(transaction => {
    return [
      transaction._id,
      `${transaction.FromName}(${transaction.FromCard}) sent ${transaction.Fromgold} (Gold Dollar)`,
      `${transaction.ToName || "unknown"} (${transaction.ToCard}) received ${
        transaction.Togold
      } (Gold Dollar)`,
      moment(transaction.Date).format("LLL"),
      transaction.remarks
    ];
  });
};
class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      last30Gold: 0,
      last30Silver: 0,
      last30Tjsc: 0,
      last30Tjsd: 0,
      startDate: moment().toISOString(),
      endDate: moment().toISOString(),
      showHTMLTransaction: false,
      userTransactions: []
    };
  }
  formatDate = (cell, row) => {
    return moment(cell).toString();
  };
  columns = [
    {
      dataField: "FromName",
      text: "From"
    },
    {
      dataField: "ToName",
      text: "To"
    },
    {
      dataField: "_id",
      text: "TransactionID"
    },
    {
      dataField: "Date",
      text: "Date",
      formatter: this.formatDate
    }
  ];

  componentWillMount() {
    const self = this;
    Meteor.call("getLast30Record", function(err, res) {
      self.setState({
        last30Gold: res.gold.toFixed(5),
        last30Silver: res.silver.toFixed(5),
        last30Tjsc: res.tjsc,
        last30Tjsd: res.tjsd
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.profile && !nextProps.profile.fullname) {
      nextProps.history.push("/profile");
    }
  }
  getRequestedTransaction = (mode, e) => {
    const self = this;
    let startDate = moment(this.state.startDate);
    let endDate = moment(this.state.endDate);
    let profile = this.props.profile;
    let {money={}} = this.props;
    let cardNumber="";
    if(money && money.cards){
      cardNumber= money.cards;
    }
    if (endDate < startDate) {
      NotificationManager.success("Please Select Valid End Date", "", 5000);
      return;
    }
    let diffMonths = startDate.diff(endDate, "months");
    if (diffMonths > 3) {
      NotificationManager.success(
        "You can request maximum 3 month at at time.",
        "",
        5000
      );
      return;
    }
    let refine = {
      startDate: new Date(startDate.startOf("day")),
      endDate: new Date(endDate.endOf("day")),
      member: "g"
    };
    if (mode === "csv")
      self.setState({
        csvDisable: true
      });

    Meteor.call(
      "getUserTransaction",
      Meteor.userId(),
      0,
      null,
      refine,
      "",
      function(error, result) {
        let _data = prepareData(result);
        if (mode === "csv") {
          let data = converter.json2csv(
            _data,
            function(err, csv) {
              if (err) {
                NotificationManager.error(
                  "Something Went Wrong! Please Try Again Later."
                );
                return;
              } else {
                let blob = new Blob([csv], {
                  type: "text/plain;charset=utf-8;"
                });
                FileSaver.saveAs(
                  blob,
                  "Transaction-" +
                    startDate.format("MM/DD/YYYY") +
                    "-" +
                    endDate.format("MM/DD/YYYY") +
                    "-" +
                    new Date().getTime() +
                    ".csv"
                );
              }
            },
            {
              emptyFieldValue: ""
            }
          );
        } //end of csv generation
        // else if(mode==='pdf')

        // self.setState(
        //   {
        //     showHTMLTransaction: mode === "html" ? true : false,
        //     userTransactions: result,
        //     csvDisable: false
        //   },
        //   () => {
        //     console.log("callback")
        if (mode === "pdf") {
          let doc = new jsPDF("p", "pt");
          let name = profile.fullname;
          let address =
            profile.address +
            ", " +
            profile.city +
            ", " +
            profile.state +
            ", " +
            profile.zip;
          let phone = Profile.findOne().phone;
          let mem = "Gold";
          doc.setFontSize(16);
          doc.text("Texas Gold Card", 26, 50);
          doc.setFontSize(14);
          doc.text("Name:   " + name, 26, 70);
          doc.text("Address:" + address, 26, 90);
          doc.text("Phone:  " + phone, 26, 110);
          doc.text("Gold:  " + self.state.last30Gold, 26, 130);
          doc.text("Silver:  " + self.state.last30Silver, 26, 150);
          doc.text(
            "Number of Gold Dollar(credit):  " + self.state.last30Tjsc,
            26,
            170
          );
          doc.text(
            "Number of Gold Dollar(debit):  " + self.state.last30Tjsd,
            26,
            190
          );
          doc.text(
            "Card Number:  " + cardNumber,
            26,
            210
          );
          // doc.addImage(img, 'PNG', 20, 40, 43, 76);
          let columns = ["TransactionID", "From", "To", "Date", "Remarks"];
          let rows = preparePDFRow(result);
          doc.autoTable(columns, rows, {
            startY: 240,
            margin: {
              horizontal: 10
            },
            styles: {
              overflow: "linebreak",
              fontSize: 10,
              columnWidth: "auto"
            },
            bodyStyles: {
              valign: "top"
            },
            tableWidth: "auto"
          });
          doc.save("transaction-" + new Date().getTime() + ".pdf");
        }
      }
    );
  };
  // );

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
    const { profile = {}, money = {} , transaction = [] } = this.props;
    if (!profile || !money) {
      return <div>Loading...</div>;
    }
    const userTransactions = this.state.userTransactions || [];
    const styles = { paddingRight: "10px" };
    return (
      <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
        <div
          className="kt-content  kt-grid__item kt-grid__item--fluid"
          id="kt_content"
        >
          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8 col-md-8 col-sm-12">
              <div className="summary">
                <div className="kt-portlet kt-portlet--height-fluid">
                  <div className="kt-portlet__head">
                    <div className="kt-portlet__head-label">
                      <h3 className="kt-portlet__head-title">
                        View Transactions
                      </h3>
                    </div>
                    <div className="kt-portlet__head-toolbar">
                      <a
                        href="#"
                        className="btn btn-label-brand btn-sm  btn-bold"
                      >
                        Subscribe to Monthly Statements
                      </a>
                    </div>
                  </div>
                  <div className="kt-portlet__body">
                    <div className="kt-widget12">
                      <div className="kt-widget12__content">
                        <div className="kt-widget12__item">
                          <div className="kt-widget12__info">
                            <span className="kt-widget12__desc">Full Name</span>
                            <span className="kt-widget12__value">
                              {profile.fullname}
                            </span>
                          </div>
                          <div className="kt-widget12__info">
                            <span className="kt-widget12__desc">Address</span>
                            <span className="kt-widget12__value">
                              {profile.address} ,{profile.city} ,{" "}
                              {profile.state}, {profile.zip}
                            </span>
                          </div>
                        </div>
                        <div className="kt-widget12__item">
                          <div className="kt-widget12__info">
                            <span className="kt-widget12__desc">
                              Mobile No.
                            </span>
                            <span className="kt-widget12__value">
                              {profile.phone}
                            </span>
                          </div>
                          <div className="kt-widget12__info">
                            <span className="kt-widget12__desc">
                              Monthly Statement
                            </span>
                            <span className="kt-widget12__value">
                              {profile.subscribe
                                ? "Subscribed"
                                : "Not Subscribed"}
                            </span>
                          </div>
                        </div>
                        <div className="kt-widget12__item">
                          <div className="kt-widget12__info">
                            <span className="kt-widget12__desc">
                              Gold (Last 30 Days)
                            </span>
                            <span className="kt-widget12__value">
                              {this.state.last30Gold}
                            </span>
                          </div>
                          <div className="kt-widget12__info">
                            <span className="kt-widget12__desc">
                              Silver (Last 30 Days)
                            </span>
                            <span className="kt-widget12__value">
                              {this.state.last30Silver}
                            </span>
                          </div>
                        </div>
                        <div className="kt-widget12__item">
                          <div className="kt-widget12__info">
                            <span className="kt-widget12__desc">
                              Number of Gold Dollar(credit - last 30 days)
                            </span>
                            <span className="kt-widget12__value">
                              {this.state.last30Tjsc} Gold Dollar
                            </span>
                          </div>
                          <div className="kt-widget12__info">
                            <span className="kt-widget12__desc">
                              Number of Gold Dollar(debit - last 30 days)
                            </span>
                            <span className="kt-widget12__value">
                              {this.state.last30Tjsd} Gold Dollar
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kt-portlet">
                <div className="kt-portlet__head">
                  <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">
                      Select Range to view history
                    </h3>
                  </div>
                </div>

                <form className="kt-form kt-form--label-right">
                  <div className="kt-portlet__body">
                    <div className="form-group row">
                      <label className="col-3 col-form-label">
                        Select Card
                      </label>
                      <div className="col-9">
                        <div className="kt-radio-inline">
                          <label className="kt-radio">
                            <input type="radio" name="radio4" /> {money.cards}
                            <span></span>
                          </label>
                        </div>
                        <span className="form-text text-muted">Gold Card</span>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-3 col-sm-12">
                        Start - End Date
                      </label>
                      <div className="col-lg-4 col-md-9 col-sm-12">
                        <div
                          className="input-daterange input-group"
                          id="kt_datepicker_5"
                        >
                          <input
                            type="date"
                            className="form-control"
                            name="start"
                            onChange={e =>
                              this.setState({ startDate: e.target.value })
                            }
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="la la-ellipsis-h"></i>
                            </span>
                          </div>
                          <input
                            type="date"
                            className="form-control"
                            name="end"
                            onChange={e =>
                              this.setState({ endDate: e.target.value })
                            }
                          />
                        </div>
                        <span className="form-text text-muted">
                          Please select From and To range to view transactions
                          in that time period.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="kt-portlet__foot">
                    <div className="kt-form__actions">
                      <div className="row">
                        <div className="col-lg-9 ml-lg-auto">
                          <button
                            className="btn btn-brand"
                            onClick={() => this.getRequestedTransaction("html")}
                            disabled={
                              !this.state.startDate || !this.state.endDate
                            }
                          >
                            View as HTML
                          </button>
                          <div
                            onClick={() => this.getRequestedTransaction("pdf")}
                            disabled={
                              !this.state.startDate || !this.state.endDate
                            }
                            className="btn btn-brand"
                            className="btn btn-brand"
                          >
                            Download as PDF
                          </div>
                          <button
                            disabled={this.state.csvDisable}
                            onClick={() => this.getRequestedTransaction("csv")}
                            className="btn btn-primary form-control asCSV"
                            className="btn btn-brand"
                          >
                            Download as CSV
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              {!this.state.showHTMLTransaction && (
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
                          <a>
                            From{" "}
                            {moment(this.state.startDate).format("MM/DD/YYYY")}{" "}
                            to {moment(this.state.endDate).format("MM/DD/YYYY")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="kt-portlet__body kt-portlet__body--fit">
                    {transaction && (
                      <Reusabletable
                        keyField="_id"
                        data={transaction}
                        columns={this.columns}
                      ></Reusabletable>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          ><div className="col-lg-2"></div>
        </div>
      </div>
    );
  }
}

const TransactionContainer = withTracker( props => {
  return {
    profile:  Profile.findOne(),
    money:  Money.findOne(),
    extraSpot:  ExtraSpot.findOne(),
    gold:  Gold.findOne()
  };
})(Transaction);

function mapStateToProps(state) {
  return {
    user: state.user,
    transaction: state.user.transactions || []
  };
}

function mapDispatchToProps(dispatch) {
  return {
    emailUnsubscribe: () => dispatch(emailUnsubscribe()),
    emailSubscribe: () => dispatch(emailSubscribe())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionContainer);

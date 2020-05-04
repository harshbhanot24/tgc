import React from 'react';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { withTracker } from 'meteor/react-meteor-data';
import { Gold } from '../../../collections/Gold';
import { Money } from '../../../collections/Money';
import { RecentTransferUser } from '../../../collections/RecentTransferUser';
import { purchaseOunce } from '../../../actions/buy';
import { sendAmount, resetTransaction } from '../../../actions/transfer'

class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiverCard: '',
      amount: 0,
      remarks: '',
      pin: ''
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if(this.props.transfer.inProgress && !nextProps.transfer.inProgress && nextProps.transfer.successMessage) {
      document.getElementById("sendPayment").reset();
      NotificationManager.success("Successfully Transfered","",3000);
      nextProps.history.push('/');
    }
  }
  componentWillUnmount() {
    this.props.resetTransaction();
  }
  handleSubmit(e) {
    e.preventDefault();
    const { gold } = this.props;
    const goldValue = gold?parseFloat(gold.data).toFixed(2): '';
    const {amount,pin,remarks,receiverCard} = this.state;
    const step = this.props.transfer.step;
    this.props.sendAmount({
      amount,pin,remarks,receiverCard,
      goldValue
    }, step)
  }
  render() {
    const {money,gold, transfer, recentTransferUser} = this.props;
    let card = '';
    if(money)
      card = money.cards;
    let recent = [];
    if(recentTransferUser) {
      recent = recentTransferUser.recent;
    }
    const {step, error, errorMessage, successMessage} = transfer;
    return (
      <div
        className="kt-content  kt-grid__item kt-grid__item--fluid"
        id="kt_content"
      >
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 col-md-8 col-sm-12">
            {error ? (
              <div>
                <span className="alert alert-danger col-sm-12">
                  {errorMessage}
                </span>
              </div>
            ) : null}

            <div className="row">
              <div className="col-lg-8 col-md-8 col-sm-12">
                <div className="kt-portlet">
                  <div className="kt-portlet__head">
                    <div className="kt-portlet__head-label">
                      <h3 className="kt-portlet__head-title">Transfer</h3>
                    </div>
                  </div>
                  {step === 1 ? (
                    <form
                      id="sendPayment"
                      className="kt-form"
                      role="form"
                      method="post"
                      onSubmit={this.handleSubmit.bind(this)}
                    >
                      <div className="kt-portlet__body">
                        <div className="form-group">
                          <label>Your Card Number:</label>
                          <p className="form-control-static">{card}</p>
                        </div>
                        <div className="form-group">
                          <label>Reciever's Card Number</label>
                          <div className="row">
                            <div className="col-3">
                              <input
                                type="text"
                                maxLength="7"
                                className="form-control"
                                name="payeecard0"
                                required
                                value={this.state.receiverCard}
                                onChange={e => {
                                  let v = e.target.value;
                                  if (v && v.length > 2) {
                                    let ind = v.indexOf("-");
                                    if (ind === -1) {
                                      v = v.substr(0, 2) + "-" + v.substr(2);
                                    }
                                  }
                                  this.setState({
                                    receiverCard: v
                                  });
                                }}
                                placeholder="NN-NNNN"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="name">
                            Amount Transfer(in GoldDollar)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className="form-control"
                            name="amount"
                            value={this.state.amount}
                            onChange={e =>
                              this.setState({ amount: e.target.value })
                            }
                            placeholder="Amount Transfer"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="pinnumber">Card Pin</label>
                          <input
                            type="password"
                            maxLength="4"
                            className="form-control"
                            name="pinnumber"
                            required
                            value={this.state.pin}
                            onChange={e =>
                              this.setState({ pin: e.target.value })
                            }
                            placeholder="Pin Number"
                          />
                        </div>
                        <div className="form-group form-group-last">
                          <label htmlFor="exampleTextarea">Remarks</label>
                          <textarea
                            className="form-control"
                            name="remarks"
                            required
                            value={this.state.remarks}
                            onChange={e =>
                              this.setState({ remarks: e.target.value })
                            }
                            placeholder="Detail about Transaction"
                            rows="4"
                          ></textarea>
                        </div>
                      </div>
                      <div className="kt-portlet__foot">
                        <div className="kt-form__actions">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={transfer.inProgress}
                          >
                            Send Gold Dollar
                          </button>
                          <button
                            type="reset"
                            className="btn btn-secondary"
                            onClick={() => {
                              this.props.resetTransaction();
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : null}
                </div>
                {step === 2 ? (
                  <form
                    id="confirmForm"
                    className="kt-form"
                    role="form"
                    method="post"
                    onSubmit={this.handleSubmit.bind(this)}
                  >
                    <div className="kt-portlet">
                      <div className="kt-portlet__head">
                        <div className="kt-portlet__head-label">
                          <span className="kt-portlet__head-icon">
                            <i className="flaticon2-graph"></i>
                          </span>
                          <h3 className="kt-portlet__head-title">
                            Confirmation
                          </h3>
                        </div>
                      </div>
                      <div className="kt-portlet__body">
                        <div className="kt-widget5">
                          <div className="kt-widget5__item">
                            <div className="kt-widget5__content">
                              <div className="kt-widget5__section">
                                <div className="kt-widget5__info">
                                  <span>Reciever's Card Number:</span>
                                  <span className="kt-font-info">
                                    {this.state.receiverCard}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="kt-widget5__item">
                            <div className="kt-widget5__content">
                              <div className="kt-widget5__section">
                                <div className="kt-widget5__info">
                                  <span>Amount Transfer(in Gold Dollar):</span>
                                  <span className="kt-font-info">
                                    {this.state.amount}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="kt-widget5__item">
                            <div className="kt-widget5__content">
                              <div className="kt-widget5__section">
                                <div className="kt-widget5__info">
                                  <span>Remarks:</span>
                                  <span className="kt-font-info">
                                    {this.state.remarks}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="kt-portlet__foot">
                        <div className="row align-items-center">
                          <div className="col-lg-6 m--valign-middle">
                            Are you sure you want to continue
                          </div>
                          <div className="col-lg-6 kt-align-right">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={transfer.inProgress}
                            >
                              Confirm
                            </button>
                            <button
                              type="reset"
                              className="btn btn-secondary"
                              id="cancelTrans"
                              onClick={() => {
                                this.props.resetTransaction();
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                  </form>
                ) : null}
                {step === 3 ? (
                  <div className="kt-portlet">
                    <div className="kt-portlet__head">
                      <div className="kt-portlet__head-label">
                        <span className="kt-portlet__head-icon">
                          <i className="flaticon2-graph"></i>
                        </span>
                        <h3 className="kt-portlet__head-title">
                          Successfully Send
                        </h3>
                      </div>
                    </div>
                    <div className="kt-portlet__body">
                      <div className="kt-widget5">
                        <div className="kt-widget5__item">
                          <div className="kt-widget5__content">
                            <div className="kt-widget5__section">
                              <div className="kt-widget5__info">
                                <span>Transaction ID:</span>
                                <span className="kt-font-info">
                                  {transfer.tId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="kt-widget5__item">
                          <div className="kt-widget5__content">
                            <div className="kt-widget5__section">
                              <div className="kt-widget5__info">
                                <span>Amount Transfered:</span>
                                <span className="kt-font-info">
                                  {this.state.amount} GoldDollar
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="kt-widget5__item">
                          <div className="kt-widget5__content">
                            <div className="kt-widget5__section">
                              <div className="kt-widget5__info">
                                <span>Remarks:</span>
                                <span className="kt-font-info">
                                  {this.state.remarks}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="kt-portlet__foot">
                      <div className="row align-items-center">
                        
                        <div className="col-lg-6 kt-align-right">
                          <Link to="/" className="btn btn-hover btn-primary">
                            Continue
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
                /*

                <div id="waitFor" style="display:none;">
                  <h2 className="btn btn-warning btn-lg">Please Wait...</h2>
                </div>
                */
                }
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="kt-portlet kt-portlet--tabs kt-portlet--height-fluid">
                  <div className="kt-portlet__head">
                    <div className="kt-portlet__head-label">
                      <h3 className="kt-portlet__head-title">
                        Users from Recent Transfer
                      </h3>
                    </div>
                  </div>
                  <div className="kt-portlet__body">
                    <div className="tab-content">
                      <div
                        className="tab-pane active"
                        id="kt_widget4_tab1_content"
                      >
                        <div className="kt-widget4">
                          {recent.map((m, i) => {
                            return (
                              <div key={i} className="kt-widget4__item">
                                <div className="kt-widget4__info">
                                  <a href="#" className="kt-widget4__username">
                                    {m.name}
                                  </a>
                                  <p className="kt-widget4__text">{m.cardNo}</p>
                                </div>
                                <a
                                  href="#"
                                  onClick={e => {
                                    this.setState({
                                      receiverCard: m.cardNo
                                    });
                                  }}
                                  className="btn btn-sm btn-label-primary btn-bold"
                                >
                                  Select
                                </a>
                              </div>
                            );
                          })}
                          {recent.length === 0 ? (
                            <h5>No Recent Transfer Found</h5>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2"></div>
      </div>
    );
  }
}


const SendContainer = withTracker((props)=>{
   Meteor.subscribe("Gold");
   Meteor.subscribe("Silver");
   Meteor.subscribe("RecentTransferUser");
 
   Meteor.subscribe("Money");
  return {
    money: Money.findOne(),
    gold: Gold.findOne(),
    recentTransferUser:RecentTransferUser.findOne()
  }
})(Send);

function mapStateToProps(state) {
  return {
    user: state.user,
    transfer: state.transfer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sendAmount: (data, step)=> dispatch(sendAmount(data, step)),
    resetTransaction: ()=> dispatch(resetTransaction())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendContainer)

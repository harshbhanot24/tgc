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
  handleSubmit(e) {
    e.preventDefault();

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
      <div className="container">
        <section className="sendPayment">
          <legend>Transfer</legend>
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title">Transfer</h3>
            </div>
            <div className="panel-body col-lg-8">
              {
                error?
                <div>
                  <span className="alert alert-danger col-sm-12">{errorMessage}</span>
                </div>
                :
                null
              }
              {
                step === 1 ?
                <form id="sendPayment" className="form-horizontal" role="form" method="post" onSubmit={this.handleSubmit.bind(this)}>
                  <div className="form-group">
                    <label htmlFor="yourcard" className="col-sm-4 control-label">Your Card Number</label>
                    <div className="col-sm-8">
                      <input type="text" disabled className="form-control" name="yourcard" required placeholder="Your Card Number" value={card}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="payeecard" className="col-sm-4 control-label">Reciever's Card Number</label>
                    <div className="col-sm-8">
                      <input type="text" maxLength="7" className="form-control" name="payeecard0" required value={this.state.receiverCard} onChange={(e)=>{
                          let v = e.target.value;
                          if(v && v.length > 2) {
                            let ind = v.indexOf('-');
                            if(ind === -1) {
                              v = v.substr(0,2) +'-'+v.substr(2);
                            }
                          }
                          this.setState({
                            receiverCard: v
                          })
                        }} placeholder="NN-NNNN" />
                    </div>
                  </div>
                  {
                    /*
                    <!--  <div className="form-group">
                      <label htmlFor="amount" className="col-sm-4 control-label">Select Transfer Currency</label>
                      <div className="col-sm-8">
                        <select name="" id="currency" className="form-control">
                          <option value="GoldDollar">Gold Dollars</option>
                          <option value="GoldOunce">Gold Ounce</option>
                          <option value="SilverOunce">Silver Ounce</option>
                        </select>
                      </div>
                    </div> -->
                    */
                  }
                  <div className="form-group">
                    <label htmlFor="amount" className="col-sm-4 control-label">Amount Transfer(in GoldDollar)</label>
                    <div className="col-sm-8">
                      <input type="number" min="0" step="any" className="form-control" name="amount" value={this.state.amount} onChange={(e)=> this.setState({amount: e.target.value})} placeholder="Amount Transfer" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pinnumber" className="col-sm-4 control-label">Card Pin</label>
                    <div className="col-sm-8">
                      <input type="password" maxLength="4" className="form-control" name="pinnumber" required value={this.state.pin} onChange={(e)=> this.setState({pin:e.target.value})} placeholder="Pin Number"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="remarks" className="col-sm-4 control-label">Remarks</label>
                    <div className="col-sm-8">
                      <textarea className="form-control" name="remarks" required value={this.state.remarks} onChange={(e)=> this.setState({remarks:e.target.value})} placeholder="Detail about Transaction" rows="4"></textarea>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-offset-5 col-sm-2">
                      <button className="btn btn-lg input-lg btn-primary" type="submit" disabled={transfer.inProgress}>Send Gold Dollar</button>
                    </div>
                  </div>
                </form>
                :
                null
              }
              {
                step === 2 ?
                <form id="confirmForm" className="form-horizontal" role="form" method="post" onSubmit={this.handleSubmit.bind(this)}>
                  <div className="form-group">
                    <div className="col-sm-offset-1 col-sm-7">
                      <h3>Are You Sure You Want to Proceed with Transfer</h3>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-2 sendbtn">
                      <button className="btn btn-lg input-lg btn-success" type="submit" disabled={transfer.inProgress}>Confirm</button>
                    </div>
                    <div className="col-sm-2 sendbtn">
                      <button className="btn btn-lg input-lg btn-danger" id="cancelTrans" type="button" onClick={()=>{
                          this.props.resetTransaction();
                        }}>Cancel</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="payeecard" className="col-sm-4 control-label">Reciever's Card Number</label>
                    <div className="col-sm-8">
                      <input type="text" min="0" maxLength="7" autoFocus="autoFocus" disabled="disabled" className="form-control disabled" name="payeecard" value={this.state.receiverCard} required placeholder="NN-NNNN"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="amount" className="col-sm-4 control-label">Amount Transfer(in Gold Dollar)</label>
                    <div className="col-sm-8">
                      <input type="text" disabled="disabled" min="0" step="any" className="form-control disabled" value={this.state.amount} name="amount" required placeholder="Amount Transfer"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="remarks" className="col-sm-4 control-label">Remarks</label>
                    <div className="col-sm-8">
                      <textarea disabled="disabled" className="form-control disabled" name="remarks" required placeholder="Detail about Transaction" rows="4" value={this.state.remarks}></textarea>
                    </div>
                  </div>
                </form>
                :
                null
              }
              {
                step === 3 ?
                <div>
                  <h3>Successfully Send</h3>
                  <br/>Transaction's Details<br/>
                  <table className='table table-responsive table-hover'><tr><td>Transaction ID:</td><td>{transfer.tId}</td></tr>
                  <tr><td>Amount Transfered</td><td>{this.state.amount} GoldDollar </td></tr>
                  <tr><td colSpan="2"><Link to='/' className='btn btn-hover btn-primary'>Continue</Link></td></tr></table>
                </div>
                :
                null
                /*

                <div id="waitFor" style="display:none;">
                  <h2 className="btn btn-warning btn-lg">Please Wait...</h2>
                </div>
                */
              }
            </div>
              <div className="panel-body col-lg-4">
                <h4>Users from Recent Transfer</h4>
                <table className="col-lg-12">
                  <tbody>
                    <tr>
                      {
                        recent.map((m, i)=>{
                            return (
                              <td key={i}>
                                <div className="radio" onClick={(e)=>{
                                    this.setState({
                                      receiverCard: m.cardNo
                                    })
                                  }}>
                                  <label>
                                    <input type="radio" name="" id="input" value="" checked="checked" />
                                    ({m.cardNo}) {m.name}
                                  </label>
                                </div>
                              </td>
                            )
                        })
                      }
                      {
                        recent.length === 0?
                        <td><h5>No Recent Transfer Found</h5></td>
                        : null
                      }
                    </tr>
                  </tbody>
                </table>
              </div>
          </div>
        </section>

      </div>
    )
  }
}


const SendContainer = withTracker((props)=>{
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

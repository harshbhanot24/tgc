import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import FileSaver from 'file-saver';
import converter from 'json-2-csv';
import { NotificationManager } from "react-notifications";
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import DatePicker from 'react-16-bootstrap-date-picker';
import { login } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import { ExtraSpot } from '../../../collections/ExtraSpot';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';
import { emailSubscribe, emailUnsubscribe } from '../../../actions/profile';

import UTILS from '../../../util'

import './style.scss';


const prepareData = function(transactions) {
  return transactions.map(transaction=>{
    return {
      TransactionID: transaction._id,
      From: `${transaction.FromName}(${transaction.FromCard}) sent ${transaction.Fromgold} (Gold Dollar)`,
      To: `${transaction.ToName || 'unknown'} (${transaction.ToCard}) received ${transaction.Togold} (Gold Dollar)`,
      Date: moment(transaction.Date).format('LLL'),
      remarks: transaction.remarks
    }
  })
}
const preparePDFRow = function(transactions) {
  return transactions.map(transaction=>{
    return [transaction._id,`${transaction.FromName}(${transaction.FromCard}) sent ${transaction.Fromgold} (Gold Dollar)`,`${transaction.ToName || 'unknown'} (${transaction.ToCard}) received ${transaction.Togold} (Gold Dollar)`, moment(transaction.Date).format('LLL'), transaction.remarks]
  })
}
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
    }
  }
  componentWillMount() {
    const self = this;
    Meteor.call('getLast30Record',function(err,res){
      this.setState({
        last30Gold: res.gold.toFixed(5),
        last30Silver: res.silver.toFixed(5),
        last30Tjsc: res.tjsc,
        last30Tjsd: res.tjsd
      })
    })
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.profile && !nextProps.profile.fullname) {
      nextProps.history.push('/profile');
    }
  }
  getRequestedTransaction(mode, e) {
    const self = this;
    let startDate = moment(this.state.startDate);
    let endDate = moment(this.state.endDate);
    let profile = this.props.profile;
    let money = this.props.money;
    if(endDate < startDate){
      NotificationManager.success("Please Select Valid End Date","",5000);
      return;
    }
    let diffMonths = startDate.diff(endDate, 'months');
    if(diffMonths > 3) {
      NotificationManager.success("You can request maximum 3 month at at time.","",5000);
      return;
    }
    let refine = {
        startDate: new Date(startDate.startOf('day')),
        endDate: new Date(endDate.endOf('day')),
        member: 'g'
    };
    if(mode === 'csv')
      self.setState({
        csvDisable: true
      })

    Meteor.call('getUserTransaction', Meteor.userId(), 0, null, refine,"", function(error, result) {
      if(mode === 'csv'){
        let _data = prepareData(result);
        let data = converter.json2csv(_data,function(err, csv) {
          if(err) {
            NotificationManager.error('Something Went Wrong! Please Try Again Later.')
            return;
          } else {
            let blob = new Blob([csv], {
                    type: "text/plain;charset=utf-8;",
              });
            FileSaver.saveAs(blob, "Transaction-" + startDate.format('MM/DD/YYYY') + "-" + endDate.format('MM/DD/YYYY') + "-" + new Date().getTime() + ".csv");
          }
        },{
          emptyFieldValue: '',
        })
      } //end of csv generation

      self.setState({
        showHTMLTransaction: mode === 'html'? true: false,
        userTransactions: result,
        csvDisable: false
      },()=>{
        if(mode === 'pdf') {
          let HTML2PDF = function demoFromHTML() {
              let doc = new jsPDF('p', 'pt');
              let name = profile.fullname;
              let address = profile.address + ", " + profile.city + ", " + profile.state + ", " + profile.zip;
              let phone = Profile.findOne().phone;
              let mem = 'Gold';
              doc.setFontSize(16);
              doc.text("Texas Gold Card", 26, 50);
              doc.setFontSize(14);
              doc.text("Name:   " + name, 26, 70);
              doc.text("Address:" + address, 26, 90);
              doc.text("Phone:  " + phone, 26, 110);
              doc.text("Gold:  " + self.state.last30Gold, 26, 130);
              doc.text("Silver:  " + self.state.last30Silver, 26, 150);
              doc.text("Number of Gold Dollar(credit):  " + self.state.last30Tjsc, 26, 170);
              doc.text("Number of Gold Dollar(debit):  " + self.state.last30Tjsd, 26, 190);
              doc.text("Card Number:  " + money.cards, 26, 210);
              // doc.addImage(img, 'PNG', 20, 40, 43, 76);
              let columns = ['TransactionID','From','To','Date','Remarks'];
              let rows = preparePDFRow(result)
              doc.autoTable(columns, rows, {
                  startY: 240,
                  margin: {
                      horizontal: 10
                  },
                  styles: {
                      overflow: 'linebreak',
                      fontSize: 10,
                      columnWidth: 'auto'
                  },
                  bodyStyles: {
                      valign: 'top'
                  },
                  tableWidth: 'auto'
              });
              doc.save('transaction-' + new Date().getTime() + '.pdf');
          };
          setTimeout(()=>{
            HTML2PDF()
          },500);
        }
      })
    });
  }
  handleLogin(e) {
    e.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    this.props.login({
      email,
      password
    })
  }
  render() {
    const {profile,money} = this.props;
    if(!profile || !money) {
      return <div>Loading...</div>
    }
    const userTransactions = this.state.userTransactions || []
    return (
      <div className='container'>
      <div className="panel panel-default">
      	<div className="panel-heading">View Transactions</div>
      	<div className="panel-body">
      		<table className="table table-hover">
            <tbody>
            <tr>
              <th>Full Name</th>
              <td>{profile.fullname}</td>
            </tr>
      			<tr>
              <th>Address</th>
              <td>{profile.address} ,{profile.city} , {profile.state}, {profile.zip}</td>
            </tr>
      			<tr>
              <th>Mobile No.</th>
              <td>{profile.phone}</td>
            </tr>
      			<tr>
              <th colSpan="2">
                <br/>Transaction History Last 30 Days
              </th>
            </tr>
      			<tr>
              <th>Gold</th>
              <td>{this.state.last30Gold} ounces</td>
            </tr>
      			<tr>
              <th>Silver</th>
              <td>{this.state.last30Silver} ounces</td>
            </tr>
      			<tr>
              <th>Number of Gold Dollar(credit)</th>
              <td>{this.state.last30Tjsc} Gold Dollar</td>
            </tr>
      			<tr>
              <th>Number of Gold Dollar(debit)</th>
              <td>{this.state.last30Tjsd} Gold Dollar</td>
            </tr>
      			<tr>
              <th>Monthly Statement</th>
                {
                  profile.subscribe?
                  (
                    <td>
                      Subscribed &nbsp;<button className="btn btn-primary" type="button" id="unsubscribe" onClick={()=>{
                        this.props.emailUnsubscribe()
                      }}>Click here to UnSubscribe</button>
                    </td>
                  )
                  :
                  (
                    <td>
                      Not Subscribe &nbsp;
                      <button onClick={()=>{
                        this.props.emailSubscribe();
                      }} type="button" className="btn btn-primary">Click here to Subscribe</button>
                    </td>
                  )
                }
              </tr>
      			<tr>
              <td><br/><br/></td>
              <td></td>
            </tr>
          </tbody>
    		</table>
        <div className="panel panel-primary">
    			<div className="panel-heading">Select Account</div>
    			<div className="panel-body">
    				<table className="table selectAccount">
    					<thead>
    						<tr><td>Card Number</td><td>Type</td></tr>
    					</thead>
    					<tbody>
    						<tr style={{backgroundColor:'#09DAA6'}}>
                  <th>
                    <input type="radio" name="accountSelection"
                      defaultChecked className="accountSelection" value="gold" /> {money.cards}
                  </th>
                  <td>Gold Dollar</td>
                </tr>
    					</tbody>
    				</table>
    				<div className="panel panel-info">
    					<div className="panel-heading">Select Date Range</div>
    					<div className="panel-body">
    						<div className="alert alert-danger error hidden">
    						</div>
    						<table className="table table-hover">
    							<tbody>
    								<tr>
                      <td className="col-lg-6">Start Date</td>
                      <td className="col-lg-6">
                        <div className="form-group">
                          <DatePicker
                            value={this.state.startDate}
                            onChange={(date)=>{
                              this.setState({
                                startDate: date
                              })
                            }}
                            minDate={moment('2018','YYYY').toISOString()}
                            maxDate={new Date().toISOString()}
                            className='form-control'
                          />
  							        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="col-lg-6">End Date</td>
                      <td className="col-lg-6">
                        <div className="form-group">
                          <DatePicker
                            value={this.state.endDate}
                            onChange={(date)=>{
                              this.setState({
                                endDate: date
                              })
                            }}
                            minDate={moment('2018','YYYY').toISOString()}
                            maxDate={new Date().toISOString()}
                            className='form-control'
                          />
  							        </div>
                      </td>
                    </tr>
    					</tbody>
    				</table>
    			</div>
    		</div>
    		<div className="row col-lg-12 actionButton">
    			<div className="col-lg-4">
    				<div onClick={this.getRequestedTransaction.bind(this, 'html')} disabled={!this.state.startDate || !this.state.endDate} className="btn btn-primary form-control asHTML">View as HTML</div>
    			</div>
    			<div className="col-lg-4">
    				<div onClick={this.getRequestedTransaction.bind(this, 'pdf')} disabled={!this.state.startDate || !this.state.endDate} className="btn btn-primary form-control asPDF">Download as PDF</div>
    			</div>
    			<div disabled={!this.state.startDate || !this.state.endDate} className="col-lg-4">
    				<div disabled={this.state.csvDisable} onClick={this.getRequestedTransaction.bind(this, 'csv')} className="btn btn-primary form-control asCSV">Download as CSV</div>
    			</div>
    		</div>
    	</div>
      </div>
        <div className={`panel panel-primary ${this.state.showHTMLTransaction?'':'hidden'} details`}>
          <div className="panel-heading">Transaction Details {moment(this.state.startDate).format('MM/DD/YYYY')} to {moment(this.state.endDate).format('MM/DD/YYYY')}</div>
          <div className="panel-body ">
            <table className="table table-striped forPDF">
              <thead>
                <tr>
                  <td colSpan="3">Name</td>
                  <td colSpan="2">{profile.fullname}</td>
                </tr>
                <tr>
                  <td colSpan="3">Card Number</td>
                  <td colSpan="2">{money.cards}</td>
                </tr>
                <tr className="warning">
                  <th>From</th>
                  <th>To</th>
                  <th>TransactionID</th>
                  <th>Date</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {
                  userTransactions.map((transaction)=>{
                    return (
                      <tr key={transaction._id}>
                        <td>{transaction.FromName}({transaction.FromCard}) sent {transaction.Fromgold} (Gold Dollar)</td>
                        <td>{transaction.ToName}({transaction.ToCard}) received {transaction.Togold} (Gold Dollar) </td>
                        <td><Link to={"/transaction/"+transaction._id}>{transaction._id}</Link></td>
                        <td>{moment(transaction.Date).format('LLL')}</td>
                        <td>{transaction.remarks}</td>
                      </tr>
                    )
                  })
                }
                {
                  userTransactions.length < 1?
                  <tr><td colSpan="7" className="text-center">No Transaction Done</td></tr>
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

    )
  }
}

const TransactionContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne(),
    money: Money.findOne(),
    extraSpot: ExtraSpot.findOne(),
    gold: Gold.findOne()
  }
})(Transaction);


function mapStateToProps(state) {
  return {
    user: state.user,
    transaction: state.user.transactions || []
  }
}

function mapDispatchToProps(dispatch) {
  return {
    emailUnsubscribe: ()=> dispatch(emailUnsubscribe()),
    emailSubscribe: ()=> dispatch(emailSubscribe())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionContainer)

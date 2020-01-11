import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import { NotificationManager } from "react-notifications";
import DatePicker from 'react-16-bootstrap-date-picker';
import {Link} from 'react-router-dom';
import converter from 'json-2-csv';
import FileSaver from 'file-saver';
import { withTracker } from 'meteor/react-meteor-data';

import UTILS from '../../../util'

const dbDetails = [{
    name: "Profile",
    description: "Contain Information about All Users Profile",
    id: "Profile"
}, {
    name: "Gold",
    description: "Contain Gold Card Info",
    id: "Money"
}, {
    name: "Transaction",
    description: "Contain User Transaction Information",
    id: "Transaction"
}, {
    name: "BlockChain",
    description: "Contain User BlockChain Information",
    id: "BlockChain"
}, {
    name: "Redeem Record",
    description: "Contain TJ REDEEM Information",
    id: "TJRedeem"
}, {
    name: "StaffActivity",
    description: "Contain Activity of Staff like adding Shipment details etc.",
    id: "StaffActivity"
}, {
    name: "StaffRequest",
    description: "Contain Request Status for Witness, Shipment Signing person",
    id: "StaffRequest"
}, {
    name: "ShipMent Details",
    description: "Contain Shipment Receiving Details",
    id: "ShipmentDetails"
}, {
    name: "Vault Movement",
    description: "Contain Vault Movement Details",
    id: "MoveToVault"
}, {
    name: "Vault",
    description: "Contain Vault Details",
    id: "Vault"
}, {
    name: "Users",
    description: "Contain Users Info",
    id: "Meteor.users"
}];
class ExportDB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false
    }
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  componentWillMount() {
    const self = this;

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;

  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const getDbDetails = dbDetails || [];
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="message_wrapper">
  			<h4 className="heading">View Database</h4>
  		</div>
  		<div>
  			<i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
  		</div>
  		<div className="table-responsive"><br/><br/>
  			<table className="table table-hover">
  				<thead>
  					<tr>
  						<th>Database Name</th>
  						<th>Description</th>
              <th>Date(Start)</th>
  						<th>Date(End)</th>
  					</tr>
  				</thead>
  				<tbody>
            {
              getDbDetails.map((data,i)=>{
                return (
                  <tr className="pointer" key={i}>
                    <td>{data.name}</td>
                    <td>{data.description}</td>
                    <td>
                      <DatePicker
                        value={this.state[data.id] && this.state[data.id].startDate?this.state[data.id].startDate: moment().toISOString()}
                        onChange={(date)=>{
                          let _d = this.state[data.id] || {};
                          _d.startDate = date;
                          this.setState({
                            [data.id]: _d
                          })
                        }}
                        minDate={moment('2018','YYYY').toISOString()}
                        className='form-control'
                      />
                    </td>
        						<td>
                      <DatePicker
                        value={this.state[data.id] && this.state[data.id].endDate?this.state[data.id].endDate: moment().toISOString()}
                        onChange={(date)=>{
                          let _d = this.state[data.id] || {};
                          _d.endDate = date;
                          this.setState({
                            [data.id]: _d
                          })
                        }}
                        minDate={moment('2018','YYYY').toISOString()}
                        className='form-control'
                      />
                    </td>
                    <td>
                      <div onClick={()=>{
                          let _d = this.state[data.id] || {};
                          let start = _d.startDate || moment().toISOString();
                          let end = _d.endDate?moment(_d.endDate).endOf('day').toItoISOString() : moment().endOf('day').toISOString();
                          let db = data.id;
                          if(db) {
                            Meteor.call('getDBBackup', db, start, end, function(err,res){
                              let _data = res || []
                              let data = converter.json2csv(_data,function(err, csv) {
                                if(err) {
                                  console.log(err);
                                  NotificationManager.error('Something Went Wrong! Please Try Again Later.')
                                  return;
                                } else {
                                  let blob = new Blob([csv], {
                                          type: "text/plain;charset=utf-8;",
                                    });
                                  FileSaver.saveAs(blob, db+"-" + moment(start).format('MM/DD/YYYY') + "-" + moment(end).format('MM/DD/YYYY') + "-" + new Date().getTime() + ".csv");
                                }
                              },{
                                emptyFieldValue: '',
                                checkSchemaDifferences: false
                              })
                            })
                          }
                        }} className="btn btn-primary btn-sm">Download Database(CSV)</div>
                    </td>

                  </tr>
                )
              })
            }
            {
              getDbDetails.length === 0?
              <tr>
    						<td colspan="4">No User Database Exist</td>
    					</tr>
              :
              null
            }
  				</tbody>
  			</table>
  		</div>
    </section>
    )
  }
}

const ExportDBContainer = withTracker((props)=>{
  return {
  }
})(ExportDB);


function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // getTodayTJSent: ()=> dispatch(getTodayTJSent()),
    // getTodayTJReceive: ()=> dispatch(getTodayTJReceive())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportDBContainer)

import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
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
}];
class ViewDB extends React.Component {
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
                      <Link to={"/view-db/"+data.id} className="btn btn-primary btn-sm">View Database</Link>
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

const ViewDBContainer = withTracker((props)=>{
  return {
  }
})(ViewDB);


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

export default connect(mapStateToProps, mapDispatchToProps)(ViewDBContainer)

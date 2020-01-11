import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import Modal from 'react-bootstrap-modal';
import { withTracker } from 'meteor/react-meteor-data';
import { login } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import DatePicker from 'react-16-bootstrap-date-picker';
import { Distributor } from '../../../collections/Distributor';
import { Gold } from '../../../collections/Gold';

import UTILS from '../../../util'

class ManageDistributor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    let name = e.target.name.value;
    let email = e.target.email.value;
    self.setState({loading: true});
    Meteor.call('updateDistributor', name, email, function(error, result) {
       if (error) NotificationManager.error(error.reason);
       else {
           NotificationManager.success('Successfully updated');
       }
    });

  }
  componentWillMount() {
    const self = this;

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;

  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const distributor = this.props.distributor || {};
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="right_col" role="main">
	<br/>
	<div className="">
		<div className="message_wrapper">
			<h4 className="heading">Manage Distributor</h4>
		</div>
		<div>
			<i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
		</div>
		<div className="panel panel-info" >
			<div className="panel-heading">
			</div>
			<div style={{paddingTop: '30px'}} className="panel-body" >
				<form onSubmit={this.handleSubmit.bind(this)} id="savedistributor" className="form-horizontal" role="form" method="post">
					<div style={{marginBottom: '25px'}} className="col-lg-12">
						<input autoFocus required id="name" type="text" className="form-control" name="name" defaultValue={distributor.name || ''} placeholder="Name" />
					</div>
					<div style={{marginBottom: "25px"}} className="col-lg-12">
						<input id="email" type="email" className="form-control" name="email" defaultValue={distributor.email || ''} required placeholder="Email" />
					</div>
					<div style={{marginTop: "10px"}} className="form-group">
						<div className="col-lg-offset-1 col-lg-4 controls">
							<button disabled={this.state.loading} type="submit" id="btn-login" name="resetlink" href="#" className="btn btn-info">Save Details</button>
						</div>
					</div>
				</form>
			</div>
		</div>

	</div>
</div>

    </section>
    )
  }
}

const ManageDistributorContainer = withTracker((props)=>{
  let isLoad = Meteor.subscribe('distributor');
  return {
    distributor: Distributor.findOne(),
    gold: Gold.findOne()
  }
})(ManageDistributor);


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

export default connect(mapStateToProps, mapDispatchToProps)(ManageDistributorContainer)

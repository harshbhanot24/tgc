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
import { Money } from '../../../collections/Money';
import { Transaction } from '../../../collections/Transaction';
import { BlockChain } from '../../../collections/BlockChain';
import { TJRedeem } from '../../../collections/TJRedeem';
import { StaffActivity } from '../../../collections/StaffActivity';
import { StaffRequest } from '../../../collections/StaffRequest';
import { ShipmentDetails } from '../../../collections/ShipmentDetails';
import { MoveToVault } from '../../../collections/MoveToVault';
import { Vault } from '../../../collections/Vault';
import { Profile } from '../../../collections/Profile';

import UTILS from '../../../util'

class ViewDBDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      total: 20
    }
  }
  handleSubmit(e) {
    e.preventDefault();

  }
  componentWillMount() {
    const self = this;

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    const params = this.props.match.params;
    const {db:dbName} = params;
    Meteor.call('getTotalDB', dbName, (err,res)=>{
      self.setState({
        total: res
      })
    })

  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const params = this.props.match.params;
    const {db:dbName} = params;
    const page = params.page || 1;
    const data = this.props.data || [];
    const total = this.state.total || 20;
    const maxPage = Math.ceil(total/20);
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="right_col" role="main">
      	<br/>
      	<div className="">
      		<div className="message_wrapper">
      			<h4 className="heading">View Database: {dbName}</h4>
      		</div>
      		<div>
      			<i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
      			<Link to="/view-db"><i className="fa fa-4x fa-arrow-left pointer" id="goBack" aria-hidden="true"></i></Link>
      		</div>
          <div className="table-responsive"><br/><br/>
      			<table className="table table-hover">
              {
                data.length === 0?
                <thead>
                  <tr>
                    <td colSpan="4">No Data Exist</td>
                  </tr>
                </thead>
                :
                  [<thead key='inl0'>
          					<tr>
          						{
                        Object.keys(data[0]).map(k=>{
                          return (
                            <th key={k}>{k}</th>
                          )
                        })
                      }
          					</tr>
          				</thead>,
          				<tbody key='inl1'>
          					{
                      data.map(d=>{
                        return (
                          <tr key={d._id}>
                            {
                              Object.keys(data[0]).map((val,o)=>{
                                return (
                                  <td key={o+"0"+new Date().getTime()}>{(typeof d[val] === 'object'? JSON.stringify(d[val]): d[val] || "")+""}</td>
                                )
                              })
                            }
                          </tr>
                        )
                      })
                    }
          				</tbody>]
              }
      			</table>
            {
              data.length !== 0 ?
                <ul className="pagination pagination-lg">
                {
                  [...Array(maxPage)].map((i,d)=>{
                    console.log(page)
                    console.log(d+1)
                    return (
                      <li className={page === (d+1)?'active':''} key={d+2}>
                        <Link to={"view-db/"+dbName+"/"+(d+1)}>{d+1}</Link>
                      </li>
                    )
                  })
                }
                </ul>
              :
                null
            }

      		</div>
    		</div>
  		</div>
    </section>
    )
  }
}

const ViewDBDetailsContainer = withTracker((props)=>{
  const params = props.match.params;
  const {db, page} = params;
  if(!db) {
    props.history.push('/view-db');
  }
  else
    Meteor.subscribe('admin-db',{
      dbName: db,
      page: page || 1,
      max: 20
    });
  return {
    data: eval(db)? eval(db).find().fetch(): []
  }
})(ViewDBDetails);


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

export default connect(mapStateToProps, mapDispatchToProps)(ViewDBDetailsContainer)

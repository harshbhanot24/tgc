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

import UTILS from '../../../util'

class BlockChain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      users: [],
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
    Meteor.call('getAllUsersDetail', 0, 20, function(err,res) {
      self.setState({
        users: res
      })
    })
    Meteor.call('getTotalDB', 'Meteor.users', (err,res)=>{
      self.setState({
        total: res
      })
    })

  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const users = this.state.users || [];
    const self = this;
    const total = this.state.total || 20;
    const params = this.props.match.params;
    const page = params.page || 1;
    const maxPage = Math.ceil(total/20);
    return (
    <section className="dashboard container bg-white">
      <div className="right_col" role="main">
        <br/>
        <div className="">
        <div className="message_wrapper">
            <h4 className="heading">View BlockChain</h4>
        </div>
        <div>
            <i className="glyphicon glyphicon-calendar fa fa-th-large"></i>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>TJg</th>
              </tr>
            </thead>
            <tbody>
              {
                users.map(user=>{
                  return (
                    <tr className='pointer' key={user.userId}>
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>{parseFloat(user.tjg).toFixed(5)}</td>
                      <td><Link to={"/track-gold/"+user.userId} className="blockchainV btn btn-primary btn-sm">View BlockChain</Link></td>
                    </tr>
                  )
                })
              }
              {
                users.length === 0 ?
                  <tr>
                      <td colSpan="4">No User Register Yet</td>
                  </tr>
                :
                null
              }
            </tbody>
          </table>
          {
            users.length !== 0 ?
              <ul className="pagination pagination-lg">
              {
                [...Array(maxPage)].map((i,d)=>{
                  return (
                    <li className={page === (d+1)?'active':''} key={d+2}>
                      <Link to={"manage-users/"+(d+1)}>{d+1}</Link>
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

const BlockChainContainer = withTracker((props)=>{
  return {
  }
})(BlockChain);


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

export default connect(mapStateToProps, mapDispatchToProps)(BlockChainContainer)

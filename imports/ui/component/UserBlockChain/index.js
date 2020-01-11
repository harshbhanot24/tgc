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

class UserBlockChain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      userName: '',
      block: []
    }
  }
  handleSubmit(e) {
    e.preventDefault();

  }
  componentWillMount() {
    const self = this;
    const params = this.props.match.params;
    const {userId} = params;

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    Meteor.call('getUserName', userId, function(err,res) {
      self.setState({
        userName: res
      })
    })
    Meteor.call('getUserBlockChain', userId, function (error, result) {
      self.setState({
        block: result
      })
    });

  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const userName = this.state.userName || '';
    const block = this.state.block || [];
    const self = this;
    return (
    <section className="dashboard container bg-white">
      <div className="right_col" role="main">
        <Link to="/track-gold"><i className="fa fa-4x fa-arrow-left pointer" id="goBack" aria-hidden="true"></i></Link>
        <legend>To {userName}</legend>
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Gold Serial</th>
                        <th>Gold Amount</th>
                        <th>Source Block</th>
                        <th>Source Name</th>
                        <th>Origin Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                {
                  block.map(b=>{
                    return (
                      <tr key={b._id}>
                          <td>{b._id}</td>
                          <td>{b.tj}</td>
                          <td><a href="#!" userid="{{sourceID}}" className="blockchainV">{b.comeFrom}</a></td>
                          <td>{b.fullname}</td>
                          <td>{moment(b.createdAt).format('LLL')}</td>
                      </tr>
                    )
                  })
                }
                {
                  block.length === 0 ?
                    <tr>
                        <td colSpan="5">No BlockChain</td>
                    </tr>
                  :
                  null
                }
            </tbody>
          </table>
        </div>
    </div>
  </section>
    )
  }
}

const UserBlockChainContainer = withTracker((props)=>{
  return {
  }
})(UserBlockChain);


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

export default connect(mapStateToProps, mapDispatchToProps)(UserBlockChainContainer)

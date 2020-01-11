import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import moment from 'moment';

class SingleTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transaction: {}
    }
  }
  componentWillMount() {
    const tId = this.props.match.params.tId || '';
    if(!tId) {
      this.props.history.push('/');
      return;
    } else {
      const self = this;
      Meteor.call('getUserTransaction', Meteor.userId(),0,tId, function (error, result) {
        if(result) {
          self.setState({
            transaction: result[0]
          })
        } else {
          self.props.history.push('/');
          return;
        }
  		});
    }

  }
  render() {
    const {transaction} = this.state;
    return (
      <div className="container">
        <Link to="/" className="btn btn-warning btn-lg input-lg" style={{margin: '10px 0px'}}>
          <i className="glyphicon glyphicon-arrow-left"> Back To Dashboard</i>
        </Link>
        <form action="" method="POST" className="form-horizontal" role="form">
            <div className="form-group">
                <legend>Transaction Details</legend>
            </div>
            <div className="form-group">
                <div className="col-sm-4">
                    <h4>Transaction ID</h4>
                </div>
                <div className="col-sm-8 alert-info">
                    <h4>{transaction._id}</h4>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-4">
                    <h4>Sender Name</h4>
                </div>
                <div className="col-sm-8 alert-info">
                    <h4>{transaction.FromName}</h4>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-4">
                    <h4>Sender Card Number</h4>
                </div>
                <div className="col-sm-8 alert-info">
                    <h4>{transaction.FromCard}</h4>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-4">
                    <h4>Reciever Name</h4>
                </div>
                <div className="col-sm-8 alert-info">
                    <h4>{transaction.ToName || '-'}</h4>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-4">
                    <h4>Reciever Card Number</h4>
                </div>
                <div className="col-sm-8 alert-info">
                    <h4>{transaction.ToCard}</h4>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-4">
                    <h4>Gold Dollar Transfer</h4>
                </div>
                <div className="col-sm-8 alert-info">
                    <h4>{transaction.FromTJTransfer} Gold Dollar</h4>
                </div>
            </div>

            <div className="form-group">
                <div className="col-sm-4">
                    <h4>Sender's Remarks</h4>
                </div>
                <div className="col-sm-8 alert-info">
                    <h4>{transaction.remarks}</h4>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-4">
                    <h4>Date &amp; Time</h4>
                </div>
                <div className="col-sm-8 alert-info">
                    <h4>{moment(transaction.Date).format('LLL')}</h4>
                </div>
            </div>
        </form>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleTransaction)

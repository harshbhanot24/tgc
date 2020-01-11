import React from 'react';
import { connect } from 'react-redux'
import { NotificationManager } from "react-notifications";
import {Link} from 'react-router-dom';
import { Profile } from '../../../collections/Profile';
import { Money } from '../../../collections/Money';
import {resetCardPin} from '../../../actions/card';

class ResetPin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const passwd = e.target.passwd.value;
    const pin = e.target.pin.value;
    const cpin = e.target.cpin.value;
    this.props.resetCardPin({
      passwd,
      pin,
      cpin
    })
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.card.inProgress && !nextProps.card.inProgress && nextProps.card.successMessage) {
      document.getElementById("resetPinform").reset();
      NotificationManager.success("Pin changed Successfully","",3000);
      nextProps.history.push('/cards');
    }
  }
  render() {
    const {error, errorMessage, inProgress, successMessage} = this.props.card;
    return (
      <div className="container">
        <div id="resetPinbox" style={{marginTop:"50px"}} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
          <div className="panel panel-info">
              <div className="panel-heading">
                <div className="panel-title">Reset Pin</div>
              </div>
              <div style={{paddingTop:"30px"}} className="panel-body">
                {
                  error?
                  <div>
                    <span className="alert alert-danger col-sm-12">{errorMessage}</span>
                  </div>
                  :
                  null
                }
                <form id="resetPinform" onSubmit={this.handleSubmit.bind(this)} className="form-horizontal" role="form" method="post" >
                  <div className="form-group">
                    <label htmlFor="password" className="col-md-3 control-label">Your Account Password</label>
                    <div className="col-md-9">
                        <input type="password" required className="form-control" name="passwd" placeholder="Password" />
                    </div>
                  </div>
                  <div className="form-group">
                      <label htmlFor="cpassword" className="col-md-3 control-label">New Pin</label>
                      <div className="col-md-9">
                          <input type="password" required className="form-control" name="pin" placeholder="NEW PIN" maxLength="4" />
                      </div>
                  </div>
                  <div className="form-group">
                      <label htmlFor="cpassword" className="col-md-3 control-label">Confirm New Pin</label>
                      <div className="col-md-9">
                          <input type="password" required className="form-control" name="cpin" placeholder="Confirm Pin" maxLength="4" />
                      </div>
                  </div>
                  <div className="form-group">
                      <div className="col-md-offset-3 col-md-9">
                          <button id="btn-signup" type="submit" className="btn btn-warning btn"><i className="icon-hand-right"></i>Set Pin</button>
                      </div>
                  </div>
                </form>
            </div>
        </div>
      </div>
    </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    card: state.card
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetCardPin: (data)=> dispatch(resetCardPin(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPin)

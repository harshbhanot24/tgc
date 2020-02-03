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
    		<div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
						<div className="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">
							<div className="row">
								<div className="col-lg-2"></div>
								<div className="col-lg-8 col-md-8 col-sm-12">
									<div className="kt-portlet">
										<div className="kt-portlet__head">
											<div className="kt-portlet__head-label">
												<h3 className="kt-portlet__head-title">
													Reset Pin
												</h3>
											</div>
										</div>
										<form className="kt-form" id="resetPinform" onSubmit={this.handleSubmit.bind(this)}>
											<div className="kt-portlet__body">
												<div className="form-group form-group-last">
												{	error && <div className="alert alert-secondary" role="alert">
														<div className="alert-icon"><i className="flaticon-warning kt-font-brand"></i></div>
														<div className="alert-text">
														{errorMessage}
														</div>
													</div>}
												</div>
												<div className="form-group">
													<label for="exampleInputPassword1">Your Account Password</label>
													<input type="password" className="form-control" name="passwd" id="exampleInputPassword1" placeholder="Password"/>
												</div>
												<div className="form-group">
													<label for="exampleInputPassword1">New Pin</label>
													<input type="password" className="form-control" id="exampleInputPassword1" name="pin" placeholder="Pin"/>
												</div>
												<div className="form-group">
													<label for="exampleInputPassword1">Confirm New Pin</label>
													<input type="password" className="form-control" id="exampleInputPassword1" name="cpin" placeholder="Confirm Pin"/>
												</div>
											</div>
											<div className="kt-portlet__foot">
												<div className="kt-form__actions">
													<button type="submit" className="btn btn-primary">Set New Pin</button>
													<button type="reset" className="btn btn-secondary">Cancel</button>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div className="col-lg-2"></div>


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

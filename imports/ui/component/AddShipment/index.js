import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { login } from '../../../actions/login';
import { NotificationManager } from "react-notifications";
import { Profile } from '../../../collections/Profile';
import { ExtraSpot } from '../../../collections/ExtraSpot';
import DatePicker from 'react-16-bootstrap-date-picker';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';
import { StaffActivity } from '../../../collections/StaffActivity';
import { StaffRequest } from '../../../collections/StaffRequest';
// import { getTodayTJSent, getTodayTJReceive } from '../../../actions/login';

import UTILS from '../../../util'

class AddShipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serialCount: 1,
      staffNames: [],
      startDate: new Date().toISOString(),
      loading: false,
      imgUrl: '',
      statusText: 'Submit'
    }
  }
  componentWillMount() {
    Meteor.subscribe('activity');
    Meteor.subscribe('requestA');
    const self = this;
    Meteor.call("getStaffName", function(error, result) {
      if (!error) {
        self.setState({
          staffNames: result
        })
      }
    });
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // Meteor.subscribe('balance');
    // this.props.getTodayTJSent();
    // this.props.getTodayTJReceive();
  }
  componentWillReceiveProps(nextProps) {

  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    const dateOfArrival = this.state.startDate;
    const type = e.target.type0.value || 'gold';
    const bar = e.target.type1.value || 'bar';
    const time = e.target.hh.value + ':' + e.target.mm.value;
    const purchaseOrderNumber = e.target.ordernum.value;
    const methodOfShipment = e.target.track.value;
    const shipmentTrackingNumber = e.target.tracknum.value;
    const witness = e.target.witness.value;
    const barCoin = e.target.barCoin.value;
    let barSerial= [{
      barSerial: e.target['serial'].value,
      ounceWeight: e.target['ounce'].value
    }]
    for(let i=0;i<this.state.serialCount;i++) {
      if(e.target['serial'+i] && e.target['serial'+i].value) {
        barSerial.push({
          barSerial: e.target['serial'+i].value,
          ounceWeight: e.target['ounce'+i].value
        })
      }
    }
    //images
    console.log({
      dateOfArrival,
      type,
      bar,
      time,
      purchaseOrderNumber,
      methodOfShipment,
      shipmentTrackingNumber,
      barSerial
    })
    const data= {
      date: dateOfArrival,
      time,
      material: type,
      purchaseOrderNumber,
      methodShipment: methodOfShipment,
      trackingNumber: shipmentTrackingNumber,
      signingPerson: witness,
      barSerial,
      numberOfBarCoin: barCoin,
      imgURL: this.state.imgUrl
    };
    self.setState({
      loading: true
    })
    Meteor.call("addShipmentDetails", data, function(err, res) {
      self.setState({
        loading: false
      })
        if (err) {
            NotificationManager.error(err.reason, '',3000);
        } else {
            NotificationManager.success('Added Successfully','',3000);
            document.getElementById('addShipment').reset();
            self.props.history.push('/');
        }
    })
  }

  render() {
    const { money, profile,staffActivity,staffRequest, extraSpot, gold, user} = this.props;
    return (
      <section className="dashboard container bg-white">
        <div className="right_col" role="main">
          <div className="">
            <div className="page-title">
              <div className="title_left" style={{marginLeft:'10px'}}>
                <h2>Shipment Entry
                  <small style={{marginLeft:'20px'}}>Shipment Details for Gold/Silver</small>
                </h2>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="x_panel">
                  <div className="x_title">
                    <div className="clearfix"></div>
                  </div>
              <div className="col-md-12 alert alert-success hide" id="successMSG"></div>
              <div className="col-md-12 alert alert-danger hide" id="errMSG"></div>
              <form onSubmit={this.handleSubmit.bind(this)} id="addShipment" data-parsley-validate className="form-horizontal form-label-left">
              <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12">Date Of Arrival <span className="required">*</span>
              </label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <div className='input-group date datePick' id='datetimepicker1'>
                  <DatePicker
                    value={this.state.startDate}
                    onChange={(date)=>{
                      this.setState({
                        startDate: date
                      })
                    }}
                    minDate={moment('2018','YYYY').toISOString()}
                    className='form-control'
                  />
                </div>
              </div>
            </div>
          <div className="form-group">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Type</label><span className="required">*</span>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div id="type" className="btn-group" data-toggle="buttons">
                <label className="btn btn-default active" >
                  <input type="radio" name="type0" value="gold" /> &nbsp; Gold &nbsp;
                </label>
                <label className="btn btn-default" >
                  <input type="radio" name="type0" value="silver" checked=""/> Silver
                </label>
              </div>
            </div>
          </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3 col-xs-12">Bar</label><span className="required">*</span>
        <div className="col-md-6 col-sm-6 col-xs-12">
          <div id="barcoin" className="btn-group" data-toggle="buttons">
            <label className="btn btn-default active" >
              <input type="radio" name="type1" value="bar"/> &nbsp; Bar &nbsp;
            </label>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Time of Arrival <span className="required">*</span>
      </label>
      <div className="col-md-2 col-sm-2 col-xs-12">
        <input type="number" id="hour" required="required" className="form-control col-md-7 col-xs-12" placeholder="HH" name="hh" max="23" maxLength="2" min="0"/>
      </div><div className="col-md-2 col-sm-2 col-xs-12">
      <input type="number" id="minute" required="required" className="form-control col-md-7 col-xs-12" maxLength="2" placeholder="MM" name="mm" max="59" min="0"/>
    </div>
  </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Purchase Order Number <span className="required">*</span>
      </label>
      <div className="col-md-6 col-sm-6 col-xs-12">
        <input type="text" id="purchasenumber" required="required" className="form-control col-md-7 col-xs-12" name="ordernum" />
      </div>
    </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Method of Shipment<span className="required">*</span>
      </label>
      <div className="col-md-6 col-sm-6 col-xs-12">
        <input type="text" id="methodShipment" required="required" className="form-control col-md-7 col-xs-12" name="track" placeholder="Ex: FedEx" />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Shipment Tracking Number <span className="required">*</span>
    </label>
    <div className="col-md-6 col-sm-6 col-xs-12">
      <input type="text" id="trackingNumber" required="required" className="form-control col-md-7 col-xs-12" name="tracknum" />
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="full-name">Full Name &nbsp;&nbsp;&nbsp;&nbsp;<small style={{color: "red"}}>Person who signed for shipment</small><span className="required">*</span>
    </label>
    <div className="col-md-6 col-sm-6 col-xs-12">
      <select name="witness" style={{border:"2px", solid: "#312E2E"}} id="witness" className="form-control input-lg " required="required" size="3" defaultValue={this.state.staffNames.length>0?this.state.staffNames[0]:''}>
        {
          this.state.staffNames.map((d,i)=>{
            return (
              <option value={d} key={i}>
                {d}
              </option>
            )
          })
        }
      </select>
    </div>
  </div>
  <div className="form-group">
    <div className="col-md-12 alert alert-danger hide" id="errCMSG"></div>
    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Number of Bars/Coins<span className="required">*</span>
    </label>
    <div className="col-md-6 col-sm-6 col-xs-12">
    <input type="number" min="1" id="numberOfBC" required="required" className="form-control col-md-7 col-xs-12" name="barCoin" />
    </div>
  </div>
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Serial Number of Bars<span className="required">*</span>
      </label>
      <div className="col-md-4 col-sm-4 col-xs-8">
        <input type="text" placeholder="Bar Serial Number" required="required" className="barid form-control col-md-7 col-xs-12" name="serial" />
      </div>
        <div className="col-md-2 col-sm-2 col-xs-4">
          <input type="number" name={'ounce'} placeholder="Ounce Weight" required className="ounceid form-control"/>
        </div>
        <div className="insertHere">
          {
            [...Array(this.state.serialCount - 1)].map((r,i)=>{
              return(
                <div key={i}>
                  <div className="col-md-4 col-sm-4 col-xs-8 col-md-offset-3 col-sm-offset-3">
                    <input placeholder="Bar Serial Number" type="text" required="required" className="barid form-control col-md-7 col-xs-12" name={'serial'+i} />
                  </div>
                  <div className="col-md-2 col-sm-2 col-xs-4">
                    <input type="number" name={'ounce'+i} placeholder="Ounce Weight" required className="ounceid form-control"/>
                  </div>
                </div>
              )
            })
          }
        </div>
        <button onClick={()=>{
            this.setState({
              serialCount: this.state.serialCount + 1
            })
          }} type="button" id="addmore" className="btn btn-primary">Add More</button>
        {
          this.state.serialCount > 1?
            <button onClick={()=>{
                this.setState({
                  serialCount: this.state.serialCount - 1
                })
              }} type="button" id="deletemore" className="btn btn-danger">Remove</button>
          :
            null
        }
        </div>
        <div className="ln_solid"></div>
        <div className="form-group">
        <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="photo">Upload Photo<span className="required">*</span>
        </label>
        <div className="col-md-6 col-sm-6 col-xs-12">
          <input id="photo" onChange={(e)=>{
              const self = this;
              let file = e.target.files[0];
              if(file){
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function() {
                  const img = reader.result;
                  self.setState({
                    statusText: 'Image Uploading...'
                  })
                  let fileName = 'shipment-'+Meteor.userId() + '-'+new Date().getTime();
                  let url = 'https://texasgold.s3.amazonaws.com/staff/images/'+fileName;
                  //upload img
                  Meteor.call('uploadStaffImg', img, fileName, (err,res)=>{
                    self.setState({
                      statusText: 'Submit',
                      imgUrl: url
                    })
                  })
                };
              }
            }} accept="image/*" type="file" />
        </div>
        </div>
        <div className="form-group">
        <div className="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
        <Link to="/" type="button" id="cancel" className="btn btn-primary">Cancel</Link>
        <button disabled={this.state.loading || !this.state.imgUrl} type="submit" className="btn btn-success">{this.state.statusText}</button>
        </div>
        </div>
        </form>
        </div>
        </div>
        </div>
        </div>
        </div>

      </section>
    )
  }
}

const AddShipmentContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne(),
    money: Money.findOne(),
    extraSpot: ExtraSpot.findOne(),
    gold: Gold.findOne(),
    staffActivity: StaffActivity.find({}, {sort: {date: -1},limit:20}).fetch(),
    staffRequest: StaffRequest.find({requestStatus:undefined}, {sort: {date: -1},limit:20}).fetch()
  }
})(AddShipment);


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

export default connect(mapStateToProps, mapDispatchToProps)(AddShipmentContainer)

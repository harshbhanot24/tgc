import React from 'react';
import {
  Meteor
} from 'meteor/meteor'
import moment from 'moment';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { NotificationManager } from "react-notifications";
import { login } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import { ExtraSpot } from '../../../collections/ExtraSpot';
import DatePicker from 'react-16-bootstrap-date-picker';
import { Money } from '../../../collections/Money';
import { Gold } from '../../../collections/Gold';
import { StaffActivity } from '../../../collections/StaffActivity';
import { StaffRequest } from '../../../collections/StaffRequest';
// import { getTodayTJSent, getTodayTJReceive } from '../../../actions/login';

import UTILS from '../../../util'

class MoveToVault extends React.Component {
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
  handleSubmit(e){
    e.preventDefault();
    const self = this;
    const dateOfTransfer = this.state.startDate;
    const type = e.target.type0.value || 'gold';
    const time = e.target.hh.value + ':' + e.target.mm.value;
    const vaultnum = e.target.vaultnum.value;
    const shelfnum = e.target.shelfnum.value;
    const boxnum = e.target.boxnum.value;
    const barCoin = e.target.barCoin.value;
    const whoTransfer = e.target.whoTransfer.value;
    const witness = e.target.witness.value;
    let barSerial= [e.target.serial.value]
    let ship = [e.target.ship.value];
    for(let i=0;i<this.state.serialCount;i++) {
      if(e.target['serial'+i] && e.target['serial'+i].value) {
        barSerial.push(e.target['serial'+i].value)
        ship.push(e.target['ship'+i].value)
      }
    }

    const data = {
      date: dateOfTransfer,
      material: type,
      time,
      vaultNumber: vaultnum,
      shelfNumber: shelfnum,
      boxNumber: boxnum,
      numberOfBarCoin: barCoin,
      whoTransferPerson:  whoTransfer,
      witnessPerson: witness,
      barSerial: barSerial,
      shipID: ship,
      imgURL: this.state.imgURL
    }
    self.setState({
      loading: true
    })
    Meteor.call("MoveToVaults", data, function(err, res) {
      self.setState({
        loading: false
      })
        if (err) {
            NotificationManager.error(err.reason, '',3000);
        } else {
            NotificationManager.success('Added Successfully','',3000);
            document.getElementById('moveToVaultForm').reset();
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
        <div className="title_left" style={{marginLeft:'20px'}}>
          <h2>Vault Movement <small style={{marginLeft: '20px'}}>Shift Details for Gold/Silver from Vault</small></h2>
        </div>

      </div>
      <div className="clearfix"></div>
      <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="x_panel">
            <div className="x_title">
              <div className="clearfix"></div>
            </div>

            <form id="moveToVaultForm" data-parsley-validate onSubmit={this.handleSubmit.bind(this)} className="form-horizontal form-label-left">
              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12">Date Of transfer <span className="required">*</span>
              </label>
              <div className="col-md-6 col-sm-6 col-xs-12">
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
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12">Type</label><span className="required">*</span>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <div id="type" className="btn-group" data-toggle="buttons">
                  <label className="btn btn-default active" >
                    <input type="radio" name="type0" value="gold" /> &nbsp; Gold &nbsp;
                  </label>
                  <label className="btn btn-default">
                    <input type="radio" name="type0" value="silver" checked="" /> Silver
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Time of transfer <span className="required">*</span>
            </label>
            <div className="col-md-2 col-sm-2 col-xs-12">
              <input type="number" id="hour" required="required" className="form-control col-md-7 col-xs-12" placeholder="HH" name="hh" max="23" min="0"/>
            </div><div className="col-md-2 col-sm-2 col-xs-12">
            <input type="number" id="minute" required="required" className="form-control col-md-7 col-xs-12" placeholder="MM" name="mm" max="59" min="0"/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Vault Number <span className="required">*</span>
          </label>
        <div className="col-md-6 col-sm-6 col-xs-12">
          <input type="text" id="vaultNumber" required="required" className="form-control col-md-7 col-xs-12" name="vaultnum" />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Shelf Number <span className="required">*</span>
      </label>
      <div className="col-md-6 col-sm-6 col-xs-12">
        <input type="text" id="shelfNumber" required="required" className="form-control col-md-7 col-xs-12" name="shelfnum" />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Box number<span className="required">*</span>
    </label>
    <div className="col-md-6 col-sm-6 col-xs-12">
      <input type="text" id="boxNumber" required="required" className="form-control col-md-7 col-xs-12" name="boxnum"  />
    </div>
  </div>
  <div className="form-group">
  <div className="col-md-12 alert alert-danger hide" id="errCMSG"></div>
    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Number of Bars in box<span className="required">*</span>
  </label>
  <div className="col-md-6 col-sm-6 col-xs-12">
    <input type="number" min="1" id="numberOfBC" required="required" className="form-control col-md-7 col-xs-12" name="barCoin" />
  </div>
  </div>
  <div className="form-group">
  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Serial Number of Bars<span className="required">*</span>
  </label>
  <div className="row">
    <div className="col-md-6 col-sm-6 col-xs-6">
      <div className="input-group">
        <div className="col-md-6">
        <input type="text" placeholder="Bar Serial Number" required="required" className="barid form-control" name="serial" /></div>
        <div className="col-md-6">
          <input type="text" placeholder="Shipment Number" required="required" className="shipid form-control" name="ship" />
        </div>
      </div>
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
  <div className="insertHere">
    {
      [...Array(this.state.serialCount - 1)].map((r,i)=>{
        return(
          <div key={i}>
            <div className="col-md-3 col-sm-3 col-xs-4 col-md-offset-3 col-sm-offset-3">
              <input placeholder="Bar Serial Number" type="text" required="required" className="barid form-control col-md-7 col-xs-12" name={"serial"+i} />
            </div>
            <div className="col-md-2 col-sm-2 col-xs-4">
              <input type="text" placeholder="Shipment Number" required="required" className="shipid form-control" name={"ship"+i} />
            </div>
          </div>
        )
      })
    }
  </div>

  </div>
  <div className="form-group">
  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Full Name &nbsp;&nbsp;&nbsp;&nbsp;<small style={{color: 'red'}}>Person who Transfered</small><span className="required">*</span>
  </label>
  <div className="col-md-6 col-sm-6 col-xs-12">
  <select name="whoTransfer" style={{border:"2px",solid: "#312E2E"}} id="whoTransfer" className="form-control input-lg " required="required" size="3" defaultValue={this.state.staffNames.length>0?this.state.staffNames[0]:''}>
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
  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Full Name &nbsp;&nbsp;&nbsp;&nbsp;<small style={{color:'red'}}>Person who witnessed Transfer</small>
  <span className="required">*</span>
  </label>
  <div className="col-md-6 col-sm-6 col-xs-12">
  <select name="witness" style={{border:"2px",solid: "#312E2E"}} id="witness" className="form-control input-lg " required="required" size="3" defaultValue={this.state.staffNames.length>0?this.state.staffNames[0]:''}>
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
            let fileName = 'move2vault-'+Meteor.userId() + '-'+new Date().getTime();
            let url = 'https://texasgold.s3.amazonaws.com/staff/images/'+fileName;
            //upload img
            Meteor.call('uploadStaffImg', img, fileName, (err,res)=>{
              console.log(res);
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
  <button type="button" id="cancel" onClick={()=>{
      this.props.history.push('/');
    }} className="btn btn-primary">Cancel</button>
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

const MoveToVaultContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne(),
    money: Money.findOne(),
    extraSpot: ExtraSpot.findOne(),
    gold: Gold.findOne()
  }
})(MoveToVault);


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

export default connect(mapStateToProps, mapDispatchToProps)(MoveToVaultContainer)

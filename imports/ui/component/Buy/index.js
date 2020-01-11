import React from 'react';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { withTracker } from 'meteor/react-meteor-data';
import { Gold } from '../../../collections/Gold';
import { Money } from '../../../collections/Money';
import { purchaseOunce } from '../../../actions/buy';

class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usdAmount: 0,
      container: 'gold',
      material: 'gold'
    }
  }
  handleLogin(e) {
    e.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    this.props.login({
      email,
      password
    })
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.buy.inProgress && !nextProps.buy.inProgress && nextProps.buy.successMessage) {
      document.getElementById("purchaseGold").reset();
      NotificationManager.success("Purchase Request Received Successfully","",3000);
      nextProps.history.push('/');
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    let membership = this.state.material;
    let name = this.state.container;
    const { gold } = this.props;
    const goldValue = gold?parseFloat(gold.data).toFixed(2): '';
    this.props.purchaseOunce({
      usdAmount: parseFloat(this.state.usdAmount),
      membership,
      name,
      goldValue
    })
  }
  render() {
    const {money,gold} = this.props;
    const {error, errorMessage, inProgress, successMessage} = this.props.buy;
    let goldValue;
    if(gold) {
      goldValue = parseFloat(gold.data).toFixed(2);
    }
    const amount = parseFloat(this.state.usdAmount) || 0;
    let goldOunce = 0;
    let gcontainer = money ? money.container || []: [];
    if(goldValue) {
      goldOunce = amount / goldValue
    }
    return (
      <div className="container">
        {
          error?
          <div>
            <span className="alert alert-danger col-sm-12">{errorMessage}</span>
          </div>
          :
          null
        }
        <form onSubmit={this.handleSubmit.bind(this)} action="#" method="POST" className="form-horizontal" id="purchaseGold" role="form" style={{padding: '0 6%'}}>
      	<div className="form-group">
      		<legend>Buy Gold</legend>
      	</div>
      	<h3>Purchase Gold</h3>
      	<div className="form-group">
      		<div className="col-sm-4">
      			Enter a Amount in USD
      		</div>
      		<div className="col-sm-8">
      			<input step="any" type="number" min="0" name="amount" id="amount" className="form-control" value={this.state.usdAmount} onChange={(e)=>this.setState({usdAmount:e.target.value})} required="required" />
      		</div>
      	</div>
      	<div className="form-group">
          {
            goldOunce?
              <div>
                <div className="col-sm-4">
            			Gold (Oz)
            		</div>
            		<div className="col-sm-8">
            			<input type="text" id="displayOZ" disabled className="form-control" value={goldOunce} name="oz" />
            		</div>
              </div>
              :
              null
          }
      	</div>
      	<div className="form-group">
      		<div className="col-sm-4">
      			Select Storage Container
      		</div>
      		<div className="col-sm-8">
      			<div className="radio">
      				<legend className="legend">Gold</legend>
              {
                gcontainer.map(gc=>{
                  return(
                    <label key={gc.name} style={{textTransform:'capitalize'}}>
            					<input onChange={(e)=>{
                          this.setState({
                            container: gc.name,
                            material: 'gold'
                          })
                        }} type="radio" material="gold" required name="storage" value={gc.name} />
            					{gc.name}
            				</label>
                  )
                })
              }
      				{
                /*
                <!-- <legend className="legend">Silver</legend>
                {{#each scontainer}}
                <label>
                  <input type="radio" material="silver" requried name="storage" value="{{name}}">
                  {{capitalize name}}
                </label>
                {{/each}} -->
                <!-- <br><br> <a href="#" data-toggle="modal" data-target="#addStorage"><span className="addMore pointer"><i className="glyphicon glyphicon-plus"></i> Add More Storage</span></a> -->
                */
              }
      			</div>
      		</div>
      	</div>
      	<div className="form-group">
      		<div className="col-sm-8 col-sm-offset-4">
      			<button type="submit" className="btn btn-primary btn-lg input-lg">Proceed to Payment</button>
      		</div>
      	</div>
      </form>
      {
        /*
        <div id="addStorage" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <!-- Modal content-->
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title"><center>Add Storage</center></h4>
              </div>
              <div className="modal-body">
                <div className="hidden alert alert-danger merr"></div>
                <div className="hidden alert alert-success mserr"></div>
                <form id="addStorages">
                  <input type="text" className="form-control" required id="storageName" placeholder="Storage Name">
                  <div className="form-group">
                    <h4>Select Storage Type:</h4>
                    <label>
                      <input type="radio" requried name="storageType" value="gold">
                      Gold
                    </label>
                    <label>
                      <input type="radio" requried name="storageType" value="silver">
                      Silver
                    </label>
                  </div>
                  <button className="btn btn-primary form-control">Add Container</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        */
      }

      </div>
    )
  }
}


const BuyContainer = withTracker((props)=>{
  return {
    money: Money.findOne(),
    gold: Gold.findOne()
  }
})(Buy);

function mapStateToProps(state) {
  return {
    user: state.user,
    buy: state.buy
  }
}

function mapDispatchToProps(dispatch) {
  return {
    purchaseOunce: (data)=> dispatch(purchaseOunce(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyContainer)

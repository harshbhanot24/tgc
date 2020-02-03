import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
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
      material: 'gold',
      requestSuccess:false
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
    if (this.props.buy.inProgress && !nextProps.buy.inProgress && nextProps.buy.successMessage) {
      document.getElementById("purchaseGold").reset();
      setTimeout(this.redirectToBuy(), 3000);
      this.setState({requestSuccess:true})
    }
  }
  
   redirectToBuy =()=> {
     let x = this.state.usdAmount;
                    let y =.029;
                    let z = x*y+.3;
                    let zz= Number(Math.round(z+'e2')+'e-2')
                    let zzz=+x+ +zz;
                    const params= {
                      price:zzz,
                      code:"Includes Credit Card Fee Of "+"$"+zz,
                      name:"Gold Payment"
                    }
  fetch('https://texasgoldcard.foxycart.com/cart', {
    method: 'post',
    body: JSON.stringify(params)
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log('Created Gist:', data.html_url);
  });
}
  handleSubmit(e) {
    e.preventDefault();
    let membership = this.state.material;
    let name = this.state.container;
    const { gold } = this.props;
    const goldValue = gold ? parseFloat(gold.data).toFixed(2) : '';
    this.props.purchaseOunce({
      usdAmount: parseFloat(this.state.usdAmount),
      membership,
      name,
      goldValue
    })
  }
  render() {
    const { money, gold } = this.props;
    const { error, errorMessage, inProgress, successMessage } = this.props.buy;
    let goldValue;
    if (gold) {
      goldValue = parseFloat(gold.data).toFixed(2);
    }
    const amount = parseFloat(this.state.usdAmount) || 0;
    let goldOunce = 0;
    let gcontainer = money ? money.container || [] : [];
    if (goldValue) {
      goldOunce = amount / goldValue
    }
    return (
      <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
        <div
          className="kt-content  kt-grid__item kt-grid__item--fluid"
          id="kt_content"
        >
          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8 col-md-8 col-sm-12">
              <div className="kt-portlet">
                <div className="kt-portlet__head">
                  <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">Buy Gold</h3>
                  </div>
                </div>
                <form
                  className="kt-form kt-form--label-right"
                  onSubmit={this.handleSubmit.bind(this)}
                  id="purchaseGold"
                >
                  <div className="kt-portlet__body">
                    <div className="form-group row">
                      <label className="col-3 col-form-label">
                        Select Storage Container
                      </label>
                      <div className="col-9">
                        <div className="kt-radio-inline">
                          <label className="kt-radio">
                            <input type="radio" name="radio4" /> Gold
                            <span></span>
                          </label>
                        </div>
                        <span className="form-text text-muted"></span>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        for="example-number-input"
                        className="col-3 col-form-label"
                      >
                        Enter a Amount in USD
                      </label>
                      <div className="col-3">
                        <input
                          step="any"
                          type="number"
                          min="0"
                          name="amount"
                          id="amount"
                          className="form-control"
                          value={this.state.usdAmount}
                          onChange={e =>
                            this.setState({ usdAmount: e.target.value })
                          }
                          required="required"
                        />
                      </div>
                      <label
                        for="example-text-input"
                        className="col-3 col-form-label"
                      >
                        Gold (Oz)
                      </label>
                      <div className="col-3">
                        <input
                          type="text"
                          id="displayOZ"
                          disabled
                          className="form-control"
                          value={goldOunce}
                          name="oz"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="kt-portlet__foot">
                    <div className="kt-form__actions">
                      <div className="row">
                        <div className="col-lg-9 ml-lg-auto">
                          <button type="submit" className="btn btn-brand">
                            Pay Online
                          </button>
                          <button type="reset" className="btn btn-secondary">
                            Pay by Check
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
             {this.state.requestSuccess && <div className="alert alert-success" role="alert">
                <strong>Congrats!</strong> Order placed successfully. Proceeding
                to payment.
              </div>}
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    );
  }
}

const BuyContainer = withTracker((props) => {
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
    purchaseOunce: (data) => dispatch(purchaseOunce(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyContainer)

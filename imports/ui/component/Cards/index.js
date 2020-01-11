import React from 'react';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Profile } from '../../../collections/Profile';
import { Money } from '../../../collections/Money';

import './style.scss';

class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

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

  }
  render() {
    const {money,profile} = this.props;
    let fullname = '';
    let cards = '';
    if(profile)
      fullname = profile.fullname || ''
    if(money)
      cards = money.cards;
    return (
      <div className="container">
        <center>
          <section className="cards">
            <div className="cardisplay noselect">
            <div className="orgTitle noselect">Texas Gold Card</div>
            <div className="cardNumber noselect">{cards}</div>
            <div className="holderName noselect">{fullname}</div>
            </div>
            <p>Your Card Details</p>
            <div className="row">
            <div className="col-lg-4">
               <h3>Card Number</h3>
            </div>
            <div className="col-lg-8"><h3>{cards}</h3></div>
            </div>
            <p>Reset Your Pin Just Click Below</p>
            <span onClick={()=>{
                this.props.history.push('/reset-pin')
              }} className="btn btn-primary btn-lg" style={{marginBottom: "30px"}} id="getPin">Reset Pin</span>
          </section>
        </center>

      </div>
    )
  }
}


const CardsContainer = withTracker((props)=>{
  return {
    profile: Profile.findOne(),
    money: Money.findOne(),
  }
})(Cards);

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardsContainer)

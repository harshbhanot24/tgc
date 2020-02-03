import React from 'react';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Profile } from '../../../collections/Profile';
import { Money } from '../../../collections/Money';

import './style.scss';
import GoldData from '../goldData';

class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    const {money,profile,gold,user} = this.props;
    let fullname = '';
    let cards = '';
    if(profile)
      fullname = profile.fullname || ''
    if(money)
	  cards = money.cards;
	  let userGold = "";
    if (money) userGold = parseFloat(money.gold);
    const goldValue = gold ? parseFloat(gold.data) : "";
    let getTJBalanceUSD;
    if (goldValue && userGold !== "" && extraSpot) {
      const totalTJ = userGold * goldValue * extraSpot.multiplier;
      getTJBalanceUSD = UTILS.currencyFormat(parseFloat(totalTJ).toFixed(2));
    }
    const todayTJSent = user.todayTJSent;
    const todayTJReceive = user.todayTJReceive;
    return (
      <div
        className="kt-content  kt-grid__item kt-grid__item--fluid"
        id="kt_content"
      >
        <div className="row">
          <div className="col-lg-2"></div>

          <div className="col-lg-8 col-md-8 col-sm-12">
            <GoldData
              userGold={userGold}
              getTJBalanceUSD={getTJBalanceUSD}
              todayTJSent={todayTJSent}
              todayTJReceive={todayTJReceive}
            />{" "}
            <div className="card center">
              <div className="card__front card__part">
                <img
                  className="card__front-square card__square"
                  src="https://image.ibb.co/cZeFjx/little_square.png"
                />
                <img
                  className="card__front-logo card__logo"
                  alt="TJ"
                  src="assets/media/logos/logo-6.png"
                />
                <p className="card_numer">{cards}</p>
                <div className="card__space-75">
                  <span className="card__label">Card holder</span>
                  <p className="card__info">{fullname}</p>
                </div>
                <div className="card__space-25">
                  <span className="card__label">Expires</span>
                  <p className="card__info">10/25</p>
                </div>
              </div>

              <div className="card__back card__part">
                <div className="card__black-line"></div>
                <div className="card__back-content">
                  <div className="card__secret">
                    <p className="card__secret--last">4200</p>
                  </div>
                  <img
                    className="card__back-square card__square"
                    src="https://image.ibb.co/cZeFjx/little_square.png"
                  />
                  <img
                    className="card__back-logo card__logo"
                    src="assets/media/logos/logo-6.png"
                  />
                </div>
              </div>
            </div>
            <div className="summary">
              <div className="kt-portlet kt-portlet--height-fluid">
                <div className="kt-portlet__head">
                  <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">Cards Summary</h3>
                  </div>
                  <div className="kt-portlet__head-toolbar">
                    <Link
                      to="/reset-pin"
                      className="btn btn-label-brand btn-sm  btn-bold"
                    >
                      Reset Pin
                    </Link>
                  </div>
                </div>
                <div className="kt-portlet__body">
                  <div className="kt-widget12">
                    <div className="kt-widget12__content">
                      <div className="kt-widget12__item">
                        <div className="kt-widget12__info">
                          <span className="kt-widget12__desc">Card Number</span>
                          <span className="kt-widget12__value">32-4169</span>
                        </div>
                        <div className="kt-widget12__info">
                          <span className="kt-widget12__desc">
                            Validity Till
                          </span>
                          <span className="kt-widget12__value">12/99</span>
                        </div>
                      </div>
                      <div className="kt-widget12__item">
                        <div className="kt-widget12__info">
                          <span className="kt-widget12__desc">Name</span>
                          <span className="kt-widget12__value">{fullname}</span>
                        </div>
                        <div className="kt-widget12__info">
                          <span className="kt-widget12__desc">Type</span>
                          <span className="kt-widget12__value">
                            Texas Gold Card
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    );
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

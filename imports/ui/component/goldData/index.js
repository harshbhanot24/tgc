import React from "react";

const GoldData = props => (
  <div className="kt-portlet">
    <div className="kt-portlet__body  kt-portlet__body--fit">
      <div className="row row-no-padding row-col-separator-xl">
        <div className="col-md-12 col-lg-6 col-xl-3">
          <div className="kt-widget24">
            <div className="kt-widget24__details">
              <div className="kt-widget24__info">
                <h4 className="kt-widget24__title">Gold Balance</h4>
                <span className="kt-widget24__desc">in ounce(s)</span>
              </div>
              <span className="kt-widget24__stats kt-font-brand">
                {props.userGold !== ""
                  ? props.userGold.toFixed(5)
                  : "Loading..."}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-6 col-xl-3">
          <div className="kt-widget24">
            <div className="kt-widget24__details">
              <div className="kt-widget24__info">
                <h4 className="kt-widget24__title">Gold Dollar Balance</h4>
                <span className="kt-widget24__desc">Converted</span>
              </div>
              <span className="kt-widget24__stats kt-font-warning">
                {props.getTJBalanceUSD !== undefined
                  ? props.getTJBalanceUSD
                  : "Loading..."}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-6 col-xl-3">
          <div className="kt-widget24">
            <div className="kt-widget24__details">
              <div className="kt-widget24__info">
                <h4 className="kt-widget24__title">Amount Sent</h4>
                <span className="kt-widget24__desc">Today</span>
              </div>
              <span className="kt-widget24__stats kt-font-danger">
                {props.todayTJSent}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-6 col-xl-3">
          <div className="kt-widget24">
            <div className="kt-widget24__details">
              <div className="kt-widget24__info">
                <h4 className="kt-widget24__title">Amount Recieved</h4>
                <span className="kt-widget24__desc">Today</span>
              </div>
              <span className="kt-widget24__stats kt-font-success">
                {props.todayTJReceive}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default GoldData;
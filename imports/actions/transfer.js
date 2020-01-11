import {
  Meteor
} from 'meteor/meteor'
import {
  Money
} from '../collections/Money';
import {
  ExtraSpot
} from '../collections/ExtraSpot';
import UTILS from '../util';

export const SEND_AMOUNT_BEGIN = "SEND_AMOUNT_BEGIN"
export const SEND_AMOUNT_SUCCESS = "SEND_AMOUNT_SUCCESS"
export const SEND_AMOUNT_FAILED = "SEND_AMOUNT_FAILED"
export const SEND_AMOUNT_RESET = "SEND_AMOUNT_RESET"

export function resetTransaction() {
  return dispatch => {
    dispatch({
      type: SEND_AMOUNT_RESET,
      step: 1
    })
  }
}
export function sendAmount(data, step = 1) {
  return dispatch => {
    const {
      amount,
      pin,
      remarks,
      receiverCard,
      goldValue
    } = data;
    const money = Money.findOne();
    let userGold = 0;
    const extraSpot = ExtraSpot.findOne();
    let multiplier = 2;
    dispatch({
      type: SEND_AMOUNT_BEGIN,
      step: 1
    })
    if (money && extraSpot && !isNaN(parseFloat(goldValue))) {
      userGold = parseFloat(money.gold);
      multiplier = extraSpot.multiplier;
    } else {
      dispatch({
        type: SEND_AMOUNT_FAILED,
        errorMessage: 'Something Went Wrong. Please Try Again.',
        step: 1
      })
      return;
    }
    if (amount == 0) {
      dispatch({
        type: SEND_AMOUNT_FAILED,
        errorMessage: 'Please enter valid amount.',
        step: 1
      })
      return;
    }
    //convert to GoldDollar
    let userTJ = multiplier * userGold * goldValue;
    let userBalance = (parseFloat(userTJ)).toFixed(2);
    let sendingAmount = parseFloat(amount);
    if (userBalance <= sendingAmount) {
      dispatch({
        type: SEND_AMOUNT_FAILED,
        errorMessage: 'Insufficient Balance for transfer.',
        step: 1
      })
      return;
    }
    if (!UTILS.isValidCard(receiverCard)) {
      dispatch({
        type: SEND_AMOUNT_FAILED,
        errorMessage: 'Enter Valid Card Number',
        step: 1
      })
      return;
    }
    if (!pin || pin.length !== 4) {
      dispatch({
        type: SEND_AMOUNT_FAILED,
        errorMessage: 'Enter Valid Pin Number',
        step: 1
      })
      return;
    }
    if (step === 1) {
      Meteor.call('checkPayeeExist', receiverCard, 'gold', function(error, result) {
        if (result) {
          Meteor.call('checkPIN', pin, function(error, result) {
            if (result) {
              dispatch({
                type: SEND_AMOUNT_SUCCESS,
                step: 2
              })
            } else {
              dispatch({
                type: SEND_AMOUNT_FAILED,
                errorMessage: 'Enter Valid Pin Number',
                step: 1
              })
              return;
            }
          });
        } else {
          dispatch({
            type: SEND_AMOUNT_FAILED,
            errorMessage: error.reason,
            step: 1
          })
        }
      });
    } else if (step === 2) {
      Meteor.call('transferMoney', receiverCard, amount, pin, remarks, parseFloat(goldValue), function(error, result) {
        if (result === -1 || error != undefined) {
          dispatch({
            type: SEND_AMOUNT_FAILED,
            errorMessage: error.reason,
            step: 1
          })
        } else {
          dispatch({
            type: SEND_AMOUNT_SUCCESS,
            step: 3,
            tId: result
          })
          $('#error').addClass('alert-success').removeClass('alert-danger').html("Successfully Send<br/>Transaction's Details<br/><table class='table table-responsive table-hover'><tr><td>Transaction ID:</td><td>" + result + "</td></tr><tr><td>Amount Transfered</td><td>" + OrAmount + " GoldDollar </td></tr><tr><td colspan=2><a href='/dashboard' class='btn btn-hover btn-primary'>Continue</a></td></tr></table>").show();
        }
      });
    }
  }
}

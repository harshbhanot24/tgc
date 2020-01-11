import {
  Meteor
} from 'meteor/meteor'

export const PURCHASE_OUNCE_BEGIN = "PURCHASE_OUNCE_BEGIN"
export const PURCHASE_OUNCE_SUCCESS = "PURCHASE_OUNCE_SUCCESS"
export const PURCHASE_OUNCE_FAILED = "PURCHASE_OUNCE_FAILED"


export function purchaseOunce(data) {
  return dispatch => {
    const {
      usdAmount,
      membership,
      name,
      goldValue
    } = data;
    dispatch({
      type: PURCHASE_OUNCE_BEGIN
    })
    if (usdAmount <= 0) {
      dispatch({
        type: PURCHASE_OUNCE_FAILED,
        errorMessage: 'Enter Valid Amount'
      })
      return;
    }
    Meteor.call('sendPurchaseRequest', usdAmount, goldValue, membership, name, function(error, result) {
      if (error) {
        dispatch({
          type: PURCHASE_OUNCE_FAILED,
          errorMessage: error.reason
        })
        return false;
      } else {
        dispatch({
          type: PURCHASE_OUNCE_SUCCESS,
          message: 'Purchase Request Received Successfully'
        })
      }
    });
  }
}

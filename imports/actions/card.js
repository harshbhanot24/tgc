import {
  Meteor
} from 'meteor/meteor'

export const RESET_CARD_PIN_BEGIN = "RESET_CARD_BEGIN"
export const RESET_CARD_PIN_SUCCESS = "RESET_CARD_PIN_SUCCESS"
export const RESET_CARD_PIN_FAILED = "RESET_CARD_PIN_FAILED"


export function resetCardPin(data) {
  return dispatch => {
    const {
      passwd,
      pin,
      cpin
    } = data;
    dispatch({
      type: RESET_CARD_PIN_BEGIN
    })
    if (pin !== cpin) {
      dispatch({
        type: RESET_CARD_PIN_FAILED,
        errorMessage: 'Pin don\'t match.'
      });
      return;
    }
    if (pin.length !== 4) {
      dispatch({
        type: RESET_CARD_PIN_FAILED,
        errorMessage: 'Pin must be of length 4.'
      });
      return;
    }
    Meteor.call('checkPassword', passwd, function(err, result) {
      if (result) {
        Meteor.call('resetPin', null, pin, function(error, result) {
          if (result) {
            dispatch({
              type: RESET_CARD_PIN_SUCCESS,
              message: 'Password is incorrect.'
            });
          } else {
            dispatch({
              type: RESET_CARD_PIN_FAILED,
              errorMessage: 'Something went wrong. Please try again.'
            });
          }
        });
      } else {
        dispatch({
          type: RESET_CARD_PIN_FAILED,
          errorMessage: 'Password is incorrect.'
        });
      }
    });
  }
}

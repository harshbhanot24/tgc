import {
  Meteor
} from 'meteor/meteor'

import UTILS from '../util/index';
import {
  login
} from './login';

export const REGISTER_SUCCESS = "REGISTER_SUCCESS"
export const REGISTER_BEGIN = "REGISTER_BEGIN"
export const REGISTER_FAILED = "REGISTER_FAILED"
const {
  isValidEmailAddress,
  isValidPassword
} = UTILS;

export function resetRegister() {
  return dispatch => {
    dispatch({
      type: REGISTER_BEGIN
    })
  }
}
export function register(data) {
  return dispatch => {
    dispatch({
      type: REGISTER_BEGIN
    })
    const email = data.email;
    const password = data.password;
    const cPassword = data.cPassword;
    const membership = 'gold';
    const merchantRequest = data.merchant;
    if (!isValidEmailAddress(email)) {
      dispatch({
        type: LOGIN_FAILED,
        errorMessage: 'Invalid Email Address'
      });
      return;
    }
    if (!isValidPassword(password, email)) {
      dispatch({
        type: REGISTER_FAILED,
        errorMessage: 'Passowrd must be atleast 7 character long alphanumeric.'
      });
      return;
    }
    if (password !== cPassword) {
      dispatch({
        type: REGISTER_FAILED,
        errorMessage: 'Password don\'t match'
      });
      return;
    }
    Meteor.call('registerNewUser', email, password, merchantRequest, function(err, res) {
      if (err) {
        dispatch({
          type: REGISTER_FAILED,
          errorMessage: err.reason ? err.reason.replace('Username', 'Email') : 'Something went wrong. Please try again.'
        });
      } else {
        dispatch({
          type: REGISTER_SUCCESS,
          message: 'Email Sent. Please check your email and click link to verify your account.'
        })

      }
    });

  }
}

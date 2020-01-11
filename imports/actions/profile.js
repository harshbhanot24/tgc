import {
  Meteor
} from 'meteor/meteor'
import UTILS from '../util/index';
const {
  isValidPassword
} = UTILS;
import {
  Accounts
} from 'meteor/accounts-base';

export const EDIT_PROFILE_BEGIN = "EDIT_PROFILE_BEGIN"
export const EDIT_PROFILE_SUCCESS = "EDIT_PROFILE_SUCCESS"
export const EDIT_PROFILE_FAILED = "EDIT_PROFILE_FAILED"
export const CHANGE_PASSWORD_BEGIN = "CHANGE_PASSWORD_BEGIN"
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS"
export const CHANGE_PASSWORD_FAILED = "CHANGE_PASSWORD_FAILED"
export const EDIT_PROFILE_QUESTION_BEGIN = "EDIT_PROFILE_QUESTION_BEGIN"
export const EDIT_PROFILE_QUESTION_SUCCESS = "EDIT_PROFILE_QUESTION_SUCCESS"
export const EDIT_PROFILE_QUESTION_FAILED = "EDIT_PROFILE_QUESTION_FAILED"

export function emailUnsubscribe() {
  return dispatch => {
    Meteor.call('updateProfile', {
      subscribe: false
    });
  }
}
export function emailSubscribe() {
  return dispatch => {
    Meteor.call('updateProfile', {
      subscribe: true
    });
  }
}
export function changePassword(data) {
  return dispatch => {
    const {
      oldpass,
      newpass,
      cnewpass,
      email
    } = data;
    dispatch({
      type: CHANGE_PASSWORD_BEGIN
    })
    if (!isValidPassword(newpass, email)) {
      dispatch({
        type: CHANGE_PASSWORD_FAILED,
        errorMessage: 'Passowrd must be atleast 7 character long alphanumeric.'
      });
      return;
    }
    if (newpass !== cnewpass) {
      dispatch({
        type: CHANGE_PASSWORD_FAILED,
        errorMessage: 'Password don\'t match'
      });
      return;
    }
    //
    Meteor.call('checkOldPasswordUse', newpass, function(err,res){
      if(res) {
        //set password
        Accounts.changePassword(oldpass, newpass, function(error) {
          if(!error) {
            dispatch({
              type: CHANGE_PASSWORD_SUCCESS,
              message: "Password Changed Successfully"
            });
            //store new pass hash
            Meteor.call('storeOldPassword', newpass);
          } else {
            dispatch({
              type: CHANGE_PASSWORD_FAILED,
              errorMessage: error.reason
            });
          }
        });
      } else {
        dispatch({
          type: CHANGE_PASSWORD_FAILED,
          errorMessage: 'You already use this password in past.'
        });
      }
    })
    console.log(data);
  }
}
export function updateSecurityQuestion(data) {
  return dispatch => {
    const {
      passwd,
      question1,
      question2,
      answer1,
      answer2
    } = data;
    dispatch({
      type: EDIT_PROFILE_QUESTION_BEGIN
    })
    Meteor.call('checkPassword', passwd, function(err, res) {
      if (res) {
        //update questions
        Meteor.call('updateProfile', {
          question1,
          question2,
          answer1,
          answer2
        }, function(error, result) {
          if (!error) {
            dispatch({
              type: EDIT_PROFILE_QUESTION_SUCCESS,
              message: 'Questions Updated Successfully'
            })
            return;
          } else {
            dispatch({
              type: EDIT_PROFILE_QUESTION_FAILED,
              errorMessage: error.reason
            })
            return;
          }
        });
        //valid
      } else {
        dispatch({
          type: EDIT_PROFILE_QUESTION_FAILED,
          errorMessage: 'Password is incorrect.'
        });
      }
    })

  }
}
export function editProfile(data) {
  return dispatch => {
    const {
      fullname,
      dob,
      address,
      city,
      state,
      phone
    } = data;
    dispatch({
      type: EDIT_PROFILE_BEGIN
    })
    if (!fullname || !address || !phone) {
      dispatch({
        type: EDIT_PROFILE_FAILED,
        errorMessage: 'Please Fill All Fields'
      })
      return;
    }
    Meteor.call('updateProfile', data, function(error, result) {
      if (!error) {
        dispatch({
          type: EDIT_PROFILE_SUCCESS,
          message: 'Profile Updated Successfully'
        })
        return;
      } else {
        dispatch({
          type: EDIT_PROFILE_FAILED,
          errorMessage: error.reason
        })
        return;
      }
    });
  }
}

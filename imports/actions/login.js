import {
  Meteor
} from 'meteor/meteor'
import UTILS from '../util/index';
import JSEncrypt from "jsencrypt";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_BEGIN = "LOGIN_BEGIN"
export const LOGIN_RESET = "LOGIN_RESET"
export const LOGIN_FAILED = "LOGIN_FAILED"
export const LOGOUT = "LOGOUT"
export const TODAY_TJ_SENT = "TODAY_TJ_SENT"
export const TODAY_TJ_RECEIVE = "TODAY_TJ_RECEIVE"
export const USER_TRANSACTIONS = "USER_TRANSACTIONS"
export const FORGOT_BEGIN = "FORGOT_BEGIN"
export const FORGOT_FAILED = "FORGOT_FAILED"
export const FORGOT_SUCCESS = "FORGOT_SUCCESS"
export const RESET_BEGIN = "RESET_BEGIN"
export const RESET_FAILED = "RESET_FAILED"
export const RESET_SUCCESS = "RESET_SUCCESS"

const {
  isValidEmailAddress,
  isValidPassword
} = UTILS;

const encrypt = (val) => {
  let jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----
              MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDmK+ODWW8zJd1hAw/YgYJ4B6bk
              0SSKWaGwxjsrsnQ4c9/a8KrK9el/G13Gry9sPlxGEwzCAvRLH9myDaW3zcMVmkTG
              TQCdtVBSZqt3wpbA5GSiODoTZ3G3+/G8UVUE9t5SI1g50c7CUuK6DRIBNH6xfLIF
              3ZEVunJXo8NBE+apAwIDAQAB
              -----END PUBLIC KEY-----`); 
 return jsEncrypt.encrypt(val);
}; 




export function resetPassword(data) {
  return dispatch => {
    const {
      token,
      password,
      cpassword
    } = data;
    dispatch({
      type: RESET_BEGIN
    })
    if (!isValidPassword(password, '')) {
      dispatch({
        type: RESET_FAILED,
        errorMessage: 'Password must be atleast 7 character long alphanumeric.'
      });
      return;
    }
    if (password !== cpassword) {
      dispatch({
        type: RESET_FAILED,
        errorMessage: 'Password don\'t match'
      });
      return;
    }
    //
    //set password
    Accounts.resetPassword(token, password, function(error) {
      if (!error) {
        dispatch({
          type: RESET_SUCCESS,
          message: "Password Changed Successfully"
        });
        //store new pass hash
        Meteor.call('storeOldPassword', password);
      } else {
        dispatch({
          type: RESET_FAILED,
          errorMessage: error.reason
        });
      }
    });

  }
}
export function forgot(data) {
  return dispatch => {
    dispatch({
      type: FORGOT_BEGIN
    })
    const email = data.email;
    if (!isValidEmailAddress(email)) {
      dispatch({
        type: FORGOT_FAILED,
        errorMessage: 'Invalid Email Address'
      });
      return;
    }
    Meteor.call('sendResetEmail', email, function(error, result) {
      if (result) {
        dispatch({
          type: FORGOT_SUCCESS,
          message: 'Reset Link Sent to Your Email Address.'
        });
        return false;
      } else {
        dispatch({
          type: FORGOT_FAILED,
          message: error.reason
        });
      }
    });
  }
}
export function resetLogin() {
  return dispatch => {
    dispatch({
      type: LOGIN_RESET,
    })
  }
}
export function loginWithToken(token){
  console.log('token:in fucntion is  ', token);
  
     return (dispatch) => {
       dispatch({
         type: LOGIN_BEGIN,
       });
     
       Meteor.loginWithToken(token, function (error) {
         if (error) {
           console.log('error: ', error);
           // if (error.reason === "Not Verified") {
           //   Router.go('verify');
           // }
           dispatch({
             errorCode: error.error,
             type: LOGIN_FAILED,
             errorMessage: error.reason,
           });
         }
          else {
           console.log("login sucessful");
           Meteor.subscribe("profile");
           Meteor.subscribe("Multiplier");
           Meteor.subscribe("balance");
           dispatch(getTodayTJSent);
           dispatch(getTodayTJReceive);
           dispatch({
             type: LOGIN_SUCCESS,
             user: Meteor.user(),
           });
           // if (Meteor.user().profile.staff != undefined || Meteor.user().profile.admin != undefined) {
           //   Router.go('sdashboard');
           // } else Router.go('dashboard');
         }
       });
     };
  
}
export function login(data) {
  return dispatch => {
    dispatch({
      type: LOGIN_BEGIN
    })
    const email = data.email;
    const password = data.password;
    if (!isValidEmailAddress(email)) {
      dispatch({
        type: LOGIN_FAILED,
        errorMessage: 'Invalid Email Address'
      });
      return;
    }
    Meteor.loginWithPassword(email, password, function (error) {
      if (error) {
        // if (error.reason === "Not Verified") {
        //   Router.go('verify');
        // }
        dispatch({
          errorCode: error.error,
          type: LOGIN_FAILED,
          errorMessage: error.reason,
        });
      } else {
        const userData= encrypt(email+ "*_*"+ password);
        localStorage.setItem("marketPlaceToken", userData);
         Meteor.subscribe("profile");
         Meteor.subscribe("Multiplier");
         Meteor.subscribe("balance");
         dispatch(getTodayTJSent);
         dispatch(getTodayTJReceive);
         dispatch({
           type: LOGIN_SUCCESS,
           user: Meteor.user(),
         });
        if (data.autoClose && data.autoClose === true) {
          const marketPlaceWindow = window.open(
            `http://192.241.152.237:8000/login?key=${userData}&autoClose=true`,
            "marketPlace",
            "width=450, height=450"
          );
        } else if (data.autoClose && data.autoClose === false) {
          const marketPlaceURL = `http://192.241.152.237:8000/login?key=${userData}&autoClose=false`;
          window.location = marketPlaceURL;
        }
    
       
       
        // if (Meteor.user().profile.staff != undefined || Meteor.user().profile.admin != undefined) {
        //   Router.go('sdashboard');
        // } else Router.go('dashboard');
      }
    });
  }
}

export function loginSuccess() {
  return dispatch => {
    if (Meteor.userId() && Meteor.user()) {
      dispatch({
        type: LOGIN_SUCCESS,
        user: Meteor.user()
      });
    }
  }
}

export function logoutUser() {
  return dispatch => {
    Meteor.logout();
    dispatch({
      type: LOGOUT
    })
  }
}

export function getTodayTJSent() {
  return dispatch => {
    Meteor.call('getTodayTJSent', function(err, res) {
      dispatch({
        type: TODAY_TJ_SENT,
        data: res
      });
    })
  }
}
export function getTodayTJReceive() {
  return dispatch => {
    Meteor.call('getTodayTJRecieve', function(err, res) {
      dispatch({
        type: TODAY_TJ_RECEIVE,
        data: res
      });
    })
  }
}

export function getTransaction() {
  return dispatch => {
    var refine = {
      startDate: new Date(new Date() - (30 * 24 * 60 * 60 * 1000)),
      endDate: new Date(),
      member: 'g'
    };
    Meteor.call('getUserTransaction', Meteor.userId(), 0, null, refine, "", 10, function(error, result) {
      dispatch({
        type: USER_TRANSACTIONS,
        data: result || []
      })
    });
  }
}

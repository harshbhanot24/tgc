import {
  merge
} from 'lodash'
import {
  LOGIN_SUCCESS,
  LOGIN_BEGIN,
  LOGIN_RESET,
  LOGIN_FAILED,
  LOGOUT,
  TODAY_TJ_SENT,
  TODAY_TJ_RECEIVE,
  USER_TRANSACTIONS,
  FORGOT_BEGIN,
  FORGOT_FAILED,
  FORGOT_SUCCESS,
  RESET_BEGIN,
  RESET_FAILED,
  RESET_SUCCESS
} from '../actions/login'

const initialState = {
  userId: '',
  email: '',
  profile: {},
  role: '',
  inProgress: false,
  error: false,
  errorMessage: '',
  errorCode: 0,
  todayTJSent: 0,
  todayTJReceive: 0,
  transactions: [],
  forgot: {
    inProgress: false,
    error: false,
    errorMessage: '',
    successMessage: ''
  },
  reset: {
    inProgress: false,
    error: false,
    errorMessage: '',
    successMessage: ''
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case RESET_BEGIN:
      return {
        ...state,
        reset: {
          inProgress: true,
          error: false,
          errorMessage: '',
          successMessage: ''
        }
      }
    case RESET_SUCCESS:
      return {
        ...state,
        reset: {
          inProgress: false,
          error: false,
          errorMessage: '',
          successMessage: action.message
        }
      }
    case RESET_FAILED:
      return {
        ...state,
        reset: {
          inProgress: false,
          error: true,
          errorMessage: action.errorMessage,
          successMessage: ''
        }
      }
    case FORGOT_BEGIN:
      return {
        ...state,
        forgot: {
          inProgress: true,
          error: false,
          errorMessage: '',
          successMessage: ''
        }
      }
    case FORGOT_SUCCESS:
      return {
        ...state,
        forgot: {
          inProgress: false,
          error: false,
          errorMessage: '',
          successMessage: action.message
        }
      }
    case FORGOT_FAILED:
      return {
        ...state,
        forgot: {
          inProgress: false,
          error: true,
          errorMessage: action.message,
          successMessage: ''
        }
      }
    case LOGIN_RESET:
      return {
        ...state,
        inProgress: false,
        error: false,
        errorMessage: '',
        successMessage: ''
      }
    case LOGIN_BEGIN:
      return {
        ...state,
        inProgress: true,
        error: false,
        errorMessage: ''
      }
    case LOGIN_SUCCESS:
      {
        const data = action.user;
        if (!data.profile) data.profile = {}

        let nextState = JSON.parse(JSON.stringify(state));
        nextState.userId = data._id;
        nextState.email = data.username;
        nextState.profile = {
          name: data.profile.name,
          userImg: data.profile.userImg
        };
        nextState.role = data.profile.staff ? 'staff' : data.profile.admin ? 'admin' : 'user';
        nextState.inProgress = false;
        nextState.error = false;
        nextState.errorMessage = '';
        return nextState;
      }
    case LOGIN_FAILED:
      return {
        ...state,
        errorCode: action.errorCode,
        inProgress: false,
        error: true,
        errorMessage: action.errorMessage
      }
    case TODAY_TJ_SENT:
      return {
        ...state,
        todayTJSent: action.data
      }
    case TODAY_TJ_RECEIVE:
      return {
        ...state,
        todayTJReceive: action.data
      }
    case USER_TRANSACTIONS:
      return {
        ...state,
        transactions: action.data
      }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
  return state
}

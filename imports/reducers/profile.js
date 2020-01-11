import {
  EDIT_PROFILE_BEGIN,
  EDIT_PROFILE_FAILED,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_QUESTION_BEGIN,
  EDIT_PROFILE_QUESTION_FAILED,
  EDIT_PROFILE_QUESTION_SUCCESS,
  CHANGE_PASSWORD_BEGIN,
  CHANGE_PASSWORD_FAILED,
  CHANGE_PASSWORD_SUCCESS
} from '../actions/profile'

const initialState = {
  profile: {
    inProgress: false,
    error: false,
    errorMessage: '',
    successMessage: ''
  },
  profileQA: {
    inProgress: false,
    error: false,
    errorMessage: '',
    successMessage: ''
  },
  password: {
    inProgress: false,
    error: false,
    errorMessage: '',
    successMessage: ''
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PASSWORD_BEGIN:
      return {
        ...state,
        password: {
          inProgress: true,
          error: false,
          errorMessage: '',
          successMessage: ''
        }
      }
    case EDIT_PROFILE_QUESTION_BEGIN:
      return {
        ...state,
        profileQA: {
          inProgress: true,
          error: false,
          errorMessage: '',
          successMessage: ''
        }
      }
    case EDIT_PROFILE_BEGIN:
      return {
        ...state,
        profile: {
          inProgress: true,
          error: false,
          errorMessage: '',
          successMessage: ''
        }
      }
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        password: {
          inProgress: false,
          error: false,
          errorMessage: '',
          successMessage: action.message
        }
      }
    case EDIT_PROFILE_SUCCESS:
      return {
        ...state,
        profile: {
          inProgress: false,
          error: false,
          errorMessage: '',
          successMessage: action.message
        }
      }
    case EDIT_PROFILE_QUESTION_SUCCESS:
      return {
        ...state,
        profileQA: {
          inProgress: false,
          error: false,
          errorMessage: '',
          successMessage: action.message
        }
      }
    case EDIT_PROFILE_QUESTION_FAILED:
      return {
        ...state,
        profileQA: {
          inProgress: false,
          error: true,
          errorMessage: action.errorMessage,
          successMessage: ''
        }
      }
    case CHANGE_PASSWORD_FAILED:
      return {
        ...state,
        password: {
          inProgress: false,
          error: true,
          errorMessage: action.errorMessage,
          successMessage: ''
        }
      }
    case EDIT_PROFILE_FAILED:
      return {
        ...state,
        profile: {
          inProgress: false,
          error: true,
          errorMessage: action.errorMessage,
          successMessage: ''
        }
      }
    default:
      return state;
  }
  return state
}

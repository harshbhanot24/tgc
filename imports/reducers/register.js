import {
  REGISTER_SUCCESS,
  REGISTER_BEGIN,
  REGISTER_FAILED
} from '../actions/register'

const initialState = {
  inProgress: false,
  error: false,
  errorMessage: '',
  successMessage: ''
}

export default function(state = initialState, action) {
  switch (action.type) {
    case REGISTER_BEGIN:
      return {
        ...state,
        inProgress: true,
        error: false,
        errorMessage: '',
        successMessage: ''
      }
    case REGISTER_SUCCESS:
      {
        let nextState = JSON.parse(JSON.stringify(state));
        nextState.inProgress= false;
        nextState.error= false;
        nextState.errorMessage= '';
        nextState.successMessage= action.message;
        return nextState;
      }
    case REGISTER_FAILED:
      return {
        ...state,
        inProgress: false,
        error: true,
        errorMessage: action.errorMessage,
        successMessage: ''
      }
    default:
      return state;
  }
  return state
}

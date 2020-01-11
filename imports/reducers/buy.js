import {
  PURCHASE_OUNCE_BEGIN,
  PURCHASE_OUNCE_FAILED,
  PURCHASE_OUNCE_SUCCESS
} from '../actions/buy'

const initialState = {
  inProgress: false,
  error: false,
  errorMessage: '',
  successMessage: ''
}

export default function(state = initialState, action) {
  switch (action.type) {
    case PURCHASE_OUNCE_BEGIN:
      return {
        ...state,
        inProgress: true,
        error: false,
        errorMessage: '',
        successMessage: ''
      }
    case PURCHASE_OUNCE_SUCCESS:
      {
        let nextState = JSON.parse(JSON.stringify(state));
        nextState.inProgress= false;
        nextState.error= false;
        nextState.errorMessage= '';
        nextState.successMessage= action.message;
        return nextState;
      }
    case PURCHASE_OUNCE_FAILED:
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

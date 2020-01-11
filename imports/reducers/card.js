import {
  RESET_CARD_PIN_BEGIN,
  RESET_CARD_PIN_FAILED,
  RESET_CARD_PIN_SUCCESS
} from '../actions/card'

const initialState = {
  inProgress: false,
  error: false,
  errorMessage: '',
  successMessage: ''
}

export default function(state = initialState, action) {
  switch (action.type) {
    case RESET_CARD_PIN_BEGIN:
      return {
        ...state,
        inProgress: true,
        error: false,
        errorMessage: '',
        successMessage: ''
      }
    case RESET_CARD_PIN_SUCCESS:
      {
        let nextState = JSON.parse(JSON.stringify(state));
        nextState.inProgress= false;
        nextState.error= false;
        nextState.errorMessage= '';
        nextState.successMessage= action.message;
        return nextState;
      }
    case RESET_CARD_PIN_FAILED:
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

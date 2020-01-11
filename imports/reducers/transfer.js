import {
  SEND_AMOUNT_BEGIN,
  SEND_AMOUNT_FAILED,
  SEND_AMOUNT_SUCCESS,
  SEND_AMOUNT_RESET
} from '../actions/transfer'

const initialState = {
  step: 1,
  inProgress: false,
  error: false,
  errorMessage: '',
  successMessage: '',
  tId: ''
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SEND_AMOUNT_BEGIN:
      return {
        ...state,
        inProgress: true,
        error: false,
        errorMessage: '',
        successMessage: '',
        tId: '',
        step: action.step || 1
      }
    case SEND_AMOUNT_SUCCESS:
      {
        let nextState = JSON.parse(JSON.stringify(state));
        nextState.inProgress= false;
        nextState.error= false;
        nextState.errorMessage= '';
        nextState.successMessage= action.message || '';
        nextState.step= action.step || 1;
        nextState.tId= action.tId || '';
        return nextState;
      }
    case SEND_AMOUNT_FAILED:
      return {
        ...state,
        inProgress: false,
        error: true,
        errorMessage: action.errorMessage,
        successMessage: '',
        tId: ''
      }
    case SEND_AMOUNT_RESET:
      return {
        ...state,
        ...initialState
      }
    default:
      return state;
  }
  return state
}

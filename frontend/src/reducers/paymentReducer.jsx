import {
  CLEAR_ERRORS,
  PAYMENT_INITIALIZE_FAIL,
  PAYMENT_INITIALIZE_REQUEST,
  PAYMENT_INITIALIZE_SUCCESS,
} from "../constants/paymentContants";

const initialState = {
  loading: false,
  redirectUrl: null,
  error: null,
};

export const paymentInitializeReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_INITIALIZE_REQUEST:
      return {
        ...state,
        loading: true,
        redirectUrl: null,
        error: null,
      };

    case PAYMENT_INITIALIZE_SUCCESS:
      return {
        ...state,
        loading: false,
        redirectUrl: action.payload, // EPS redirect URL
        error: null,
      };

    case PAYMENT_INITIALIZE_FAIL:
      return {
        ...state,
        loading: false,
        redirectUrl: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

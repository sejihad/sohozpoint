import {
  ADVANCED_PAYMENT_FAIL,
  ADVANCED_PAYMENT_REQUEST,
  ADVANCED_PAYMENT_SUCCESS,
  CLEAR_ERRORS,
  DELETE_ADVANCED_PAYMENT_FAIL,
  DELETE_ADVANCED_PAYMENT_REQUEST,
  DELETE_ADVANCED_PAYMENT_RESET,
  DELETE_ADVANCED_PAYMENT_SUCCESS,
  UPDATE_ADVANCED_PAYMENT_FAIL,
  UPDATE_ADVANCED_PAYMENT_REQUEST,
  UPDATE_ADVANCED_PAYMENT_RESET,
  UPDATE_ADVANCED_PAYMENT_SUCCESS,
} from "../constants/AdvancedPaymentContants";

// Get Advanced Payment (singleton)
export const advancedPaymentReducer = (
  state = { advancedPayment: null },
  action,
) => {
  switch (action.type) {
    case ADVANCED_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ADVANCED_PAYMENT_SUCCESS:
      return {
        loading: false,
        advancedPayment: action.payload, // doc or null
      };

    case ADVANCED_PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
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

// Update (Upsert) Advanced Payment
export const advancedPaymentUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ADVANCED_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_ADVANCED_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: true,
        advancedPayment: action.payload, // updated doc
      };

    case UPDATE_ADVANCED_PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_ADVANCED_PAYMENT_RESET:
      return {
        ...state,
        isUpdated: false,
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

// Optional: Delete/Reset Advanced Payment
export const advancedPaymentDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_ADVANCED_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_ADVANCED_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload, // true/false
      };

    case DELETE_ADVANCED_PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_ADVANCED_PAYMENT_RESET:
      return {
        ...state,
        isDeleted: false,
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

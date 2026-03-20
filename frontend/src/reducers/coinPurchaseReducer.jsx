import {
  COIN_PURCHASE_CANCEL_FAIL,
  COIN_PURCHASE_CANCEL_REQUEST,
  COIN_PURCHASE_CANCEL_SUCCESS,
  COIN_PURCHASE_CLEAR_ERRORS,
  COIN_PURCHASE_FAIL_FAIL,
  COIN_PURCHASE_FAIL_REQUEST,
  COIN_PURCHASE_FAIL_SUCCESS,
  COIN_PURCHASE_INIT_FAIL,
  COIN_PURCHASE_INIT_REQUEST,
  COIN_PURCHASE_INIT_SUCCESS,
  COIN_PURCHASE_VERIFY_FAIL,
  COIN_PURCHASE_VERIFY_REQUEST,
  COIN_PURCHASE_VERIFY_SUCCESS,
} from "../constants/coinPurchaseContants";

const initialState = {
  loading: false,
  success: false,
  message: null,
  coinsAdded: 0,
  error: null,
};

export const coinPurchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case COIN_PURCHASE_INIT_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case COIN_PURCHASE_INIT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: "Redirecting to payment...",
      };

    case COIN_PURCHASE_INIT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case COIN_PURCHASE_VERIFY_REQUEST:
    case COIN_PURCHASE_FAIL_REQUEST:
    case COIN_PURCHASE_CANCEL_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case COIN_PURCHASE_VERIFY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload?.message,
        coinsAdded: action.payload?.coinsAdded || 0,
      };

    case COIN_PURCHASE_FAIL_SUCCESS:
    case COIN_PURCHASE_CANCEL_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload?.message,
      };

    case COIN_PURCHASE_VERIFY_FAIL:
    case COIN_PURCHASE_FAIL_FAIL:
    case COIN_PURCHASE_CANCEL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case COIN_PURCHASE_CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

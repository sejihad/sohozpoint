import {
  ADMIN_CHARGE_FAIL,
  ADMIN_CHARGE_REQUEST,
  ADMIN_CHARGE_SUCCESS,
  ALL_CHARGE_FAIL,
  ALL_CHARGE_REQUEST,
  ALL_CHARGE_SUCCESS,
  CHARGE_DETAILS_FAIL,
  CHARGE_DETAILS_REQUEST,
  CHARGE_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  DELETE_CHARGE_FAIL,
  DELETE_CHARGE_REQUEST,
  DELETE_CHARGE_RESET,
  DELETE_CHARGE_SUCCESS,
  NEW_CHARGE_FAIL,
  NEW_CHARGE_REQUEST,
  NEW_CHARGE_RESET,
  NEW_CHARGE_SUCCESS,
  UPDATE_CHARGE_FAIL,
  UPDATE_CHARGE_REQUEST,
  UPDATE_CHARGE_RESET,
  UPDATE_CHARGE_SUCCESS,
} from "../constants/chargeContants";

// ✅ Get Charge (Public & Admin)
export const chargesReducer = (state = { charge: {} }, action) => {
  switch (action.type) {
    case ALL_CHARGE_REQUEST:
    case ADMIN_CHARGE_REQUEST:
      return {
        loading: true,
        charge: {},
      };
    case ALL_CHARGE_SUCCESS:
    case ADMIN_CHARGE_SUCCESS:
      return {
        loading: false,
        charge: action.payload,
      };
    case ALL_CHARGE_FAIL:
    case ADMIN_CHARGE_FAIL:
      return {
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

// ✅ Create new charge (Admin)
export const newChargeReducer = (state = { charge: {} }, action) => {
  switch (action.type) {
    case NEW_CHARGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_CHARGE_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        charge: action.payload.charge,
      };
    case NEW_CHARGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_CHARGE_RESET:
      return {
        ...state,
        success: false,
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

// ✅ Update / Delete Charge (Admin)
export const chargeReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_CHARGE_REQUEST:
    case UPDATE_CHARGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_CHARGE_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_CHARGE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_CHARGE_FAIL:
    case UPDATE_CHARGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_CHARGE_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_CHARGE_RESET:
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

// ✅ Charge Details
export const chargeDetailsReducer = (state = { charge: {} }, action) => {
  switch (action.type) {
    case CHARGE_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case CHARGE_DETAILS_SUCCESS:
      return {
        loading: false,
        charge: action.payload,
      };
    case CHARGE_DETAILS_FAIL:
      return {
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

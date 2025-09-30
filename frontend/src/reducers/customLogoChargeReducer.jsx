import {
  ADMIN_LOGO_CHARGE_FAIL,
  ADMIN_LOGO_CHARGE_REQUEST,
  ADMIN_LOGO_CHARGE_SUCCESS,
  ALL_LOGO_CHARGE_FAIL,
  ALL_LOGO_CHARGE_REQUEST,
  ALL_LOGO_CHARGE_SUCCESS,
  CLEAR_ERRORS,
  DELETE_LOGO_CHARGE_FAIL,
  DELETE_LOGO_CHARGE_REQUEST,
  DELETE_LOGO_CHARGE_RESET,
  DELETE_LOGO_CHARGE_SUCCESS,
  LOGO_CHARGE_DETAILS_FAIL,
  LOGO_CHARGE_DETAILS_REQUEST,
  LOGO_CHARGE_DETAILS_SUCCESS,
  NEW_LOGO_CHARGE_FAIL,
  NEW_LOGO_CHARGE_REQUEST,
  NEW_LOGO_CHARGE_RESET,
  NEW_LOGO_CHARGE_SUCCESS,
  UPDATE_LOGO_CHARGE_FAIL,
  UPDATE_LOGO_CHARGE_REQUEST,
  UPDATE_LOGO_CHARGE_RESET,
  UPDATE_LOGO_CHARGE_SUCCESS,
} from "../constants/customLogoChargeContants";

// ✅ Get Charge (Public & Admin)
export const customLogochargesReducer = (state = { charge: {} }, action) => {
  switch (action.type) {
    case ALL_LOGO_CHARGE_REQUEST:
    case ADMIN_LOGO_CHARGE_REQUEST:
      return {
        loading: true,
        charge: {},
      };
    case ALL_LOGO_CHARGE_SUCCESS:
    case ADMIN_LOGO_CHARGE_SUCCESS:
      return {
        loading: false,
        charge: action.payload,
      };
    case ALL_LOGO_CHARGE_FAIL:
    case ADMIN_LOGO_CHARGE_FAIL:
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
export const newCustomLogoChargeReducer = (state = { charge: {} }, action) => {
  switch (action.type) {
    case NEW_LOGO_CHARGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_LOGO_CHARGE_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        charge: action.payload.charge,
      };
    case NEW_LOGO_CHARGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_LOGO_CHARGE_RESET:
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
export const customLogoChargeReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_LOGO_CHARGE_REQUEST:
    case UPDATE_LOGO_CHARGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_LOGO_CHARGE_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_LOGO_CHARGE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_LOGO_CHARGE_FAIL:
    case UPDATE_LOGO_CHARGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_LOGO_CHARGE_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_LOGO_CHARGE_RESET:
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
export const customLogoChargeDetailsReducer = (
  state = { charge: {} },
  action
) => {
  switch (action.type) {
    case LOGO_CHARGE_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case LOGO_CHARGE_DETAILS_SUCCESS:
      return {
        loading: false,
        charge: action.payload,
      };
    case LOGO_CHARGE_DETAILS_FAIL:
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

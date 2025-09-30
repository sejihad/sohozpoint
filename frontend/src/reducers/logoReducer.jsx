import {
  ADMIN_LOGO_FAIL,
  ADMIN_LOGO_REQUEST,
  ADMIN_LOGO_SUCCESS,
  ALL_LOGO_FAIL,
  ALL_LOGO_REQUEST,
  ALL_LOGO_SUCCESS,
  CLEAR_ERRORS,
  DELETE_LOGO_FAIL,
  DELETE_LOGO_REQUEST,
  DELETE_LOGO_RESET,
  DELETE_LOGO_SUCCESS,
  LOGO_DETAILS_FAIL,
  LOGO_DETAILS_REQUEST,
  LOGO_DETAILS_SUCCESS,
  NEW_LOGO_FAIL,
  NEW_LOGO_REQUEST,
  NEW_LOGO_RESET,
  NEW_LOGO_SUCCESS,
  UPDATE_LOGO_FAIL,
  UPDATE_LOGO_REQUEST,
  UPDATE_LOGO_RESET,
  UPDATE_LOGO_SUCCESS,
} from "../constants/logoContants";

// ✅ Get all logos (Public & Admin)
export const logosReducer = (state = { logos: [] }, action) => {
  switch (action.type) {
    case ALL_LOGO_REQUEST:
    case ADMIN_LOGO_REQUEST:
      return {
        loading: true,
        logos: [],
      };
    case ALL_LOGO_SUCCESS:
      return {
        loading: false,
        logos: action.payload.logos,
      };
    case ADMIN_LOGO_SUCCESS:
      return {
        loading: false,
        logos: action.payload,
      };
    case ALL_LOGO_FAIL:
    case ADMIN_LOGO_FAIL:
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

// ✅ Create new logo (Admin)
export const newLogoReducer = (state = { logo: {} }, action) => {
  switch (action.type) {
    case NEW_LOGO_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_LOGO_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        logo: action.payload.logo,
      };
    case NEW_LOGO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_LOGO_RESET:
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

// ✅ Update / Delete Logo
export const logoReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_LOGO_REQUEST:
    case UPDATE_LOGO_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_LOGO_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_LOGO_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_LOGO_FAIL:
    case UPDATE_LOGO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_LOGO_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_LOGO_RESET:
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

// ✅ Logo Details
export const logoDetailsReducer = (state = { logo: {} }, action) => {
  switch (action.type) {
    case LOGO_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case LOGO_DETAILS_SUCCESS:
      return {
        loading: false,
        logo: action.payload,
      };
    case LOGO_DETAILS_FAIL:
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

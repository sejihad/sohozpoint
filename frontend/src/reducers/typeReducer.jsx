import {
  ADMIN_TYPE_FAIL,
  ADMIN_TYPE_REQUEST,
  ADMIN_TYPE_SUCCESS,
  ALL_TYPE_FAIL,
  ALL_TYPE_REQUEST,
  ALL_TYPE_SUCCESS,
  CLEAR_ERRORS,
  DELETE_TYPE_FAIL,
  DELETE_TYPE_REQUEST,
  DELETE_TYPE_RESET,
  DELETE_TYPE_SUCCESS,
  NEW_TYPE_FAIL,
  NEW_TYPE_REQUEST,
  NEW_TYPE_RESET,
  NEW_TYPE_SUCCESS,
  TYPE_DETAILS_FAIL,
  TYPE_DETAILS_REQUEST,
  TYPE_DETAILS_SUCCESS,
  UPDATE_TYPE_FAIL,
  UPDATE_TYPE_REQUEST,
  UPDATE_TYPE_RESET,
  UPDATE_TYPE_SUCCESS,
} from "../constants/typeContants";

// ✅ Get All Types / Admin Types
export const typesReducer = (state = { types: [] }, action) => {
  switch (action.type) {
    case ALL_TYPE_REQUEST:
    case ADMIN_TYPE_REQUEST:
      return { loading: true, types: [] };
    case ALL_TYPE_SUCCESS:
      return { loading: false, types: action.payload };
    case ADMIN_TYPE_SUCCESS:
      return { loading: false, types: action.payload };
    case ALL_TYPE_FAIL:
    case ADMIN_TYPE_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// ✅ Create Type
export const newTypeReducer = (state = { type: {} }, action) => {
  switch (action.type) {
    case NEW_TYPE_REQUEST:
      return { ...state, loading: true };
    case NEW_TYPE_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        type: action.payload.type,
      };
    case NEW_TYPE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case NEW_TYPE_RESET:
      return { ...state, success: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// ✅ Delete / Update Type
export const typeReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_TYPE_REQUEST:
    case UPDATE_TYPE_REQUEST:
      return { ...state, loading: true };
    case DELETE_TYPE_SUCCESS:
      return { ...state, loading: false, isDeleted: action.payload };
    case UPDATE_TYPE_SUCCESS:
      return { ...state, loading: false, isUpdated: action.payload };
    case DELETE_TYPE_FAIL:
    case UPDATE_TYPE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case DELETE_TYPE_RESET:
      return { ...state, isDeleted: false };
    case UPDATE_TYPE_RESET:
      return { ...state, isUpdated: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// ✅ Type Details
export const typeDetailsReducer = (state = { type: {} }, action) => {
  switch (action.type) {
    case TYPE_DETAILS_REQUEST:
      return { loading: true, ...state };
    case TYPE_DETAILS_SUCCESS:
      return { loading: false, type: action.payload };
    case TYPE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

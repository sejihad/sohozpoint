// reducers/subsubcategoryReducer.js
import {
  ADMIN_SUBSUBCATEGORY_FAIL,
  ADMIN_SUBSUBCATEGORY_REQUEST,
  ADMIN_SUBSUBCATEGORY_SUCCESS,
  ALL_SUBSUBCATEGORY_FAIL,
  ALL_SUBSUBCATEGORY_REQUEST,
  ALL_SUBSUBCATEGORY_SUCCESS,
  CLEAR_ERRORS,
  DELETE_SUBSUBCATEGORY_FAIL,
  DELETE_SUBSUBCATEGORY_REQUEST,
  DELETE_SUBSUBCATEGORY_RESET,
  DELETE_SUBSUBCATEGORY_SUCCESS,
  NEW_SUBSUBCATEGORY_FAIL,
  NEW_SUBSUBCATEGORY_REQUEST,
  NEW_SUBSUBCATEGORY_RESET,
  NEW_SUBSUBCATEGORY_SUCCESS,
  SUBSUBCATEGORY_DETAILS_FAIL,
  SUBSUBCATEGORY_DETAILS_REQUEST,
  SUBSUBCATEGORY_DETAILS_SUCCESS,
  UPDATE_SUBSUBCATEGORY_FAIL,
  UPDATE_SUBSUBCATEGORY_REQUEST,
  UPDATE_SUBSUBCATEGORY_RESET,
  UPDATE_SUBSUBCATEGORY_SUCCESS,
} from "../constants/subsubcategoryContants";

// Get all subsubcategories
export const subsubcategoriesReducer = (
  state = { subsubcategories: [] },
  action
) => {
  switch (action.type) {
    case ALL_SUBSUBCATEGORY_REQUEST:
    case ADMIN_SUBSUBCATEGORY_REQUEST:
      return {
        loading: true,
        subsubcategories: [],
      };
    case ALL_SUBSUBCATEGORY_SUCCESS:
      return {
        loading: false,
        subsubcategories: action.payload,
      };
    case ADMIN_SUBSUBCATEGORY_SUCCESS:
      return {
        loading: false,
        subsubcategories: action.payload,
      };
    case ALL_SUBSUBCATEGORY_FAIL:
    case ADMIN_SUBSUBCATEGORY_FAIL:
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

// Create subsubcategory
export const newSubsubcategoryReducer = (
  state = { subsubcategory: {} },
  action
) => {
  switch (action.type) {
    case NEW_SUBSUBCATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_SUBSUBCATEGORY_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        subsubcategory: action.payload.subsubcategory,
      };
    case NEW_SUBSUBCATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_SUBSUBCATEGORY_RESET:
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

// Update & Delete subsubcategory
export const subsubcategoryReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_SUBSUBCATEGORY_REQUEST:
    case UPDATE_SUBSUBCATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_SUBSUBCATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_SUBSUBCATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_SUBSUBCATEGORY_FAIL:
    case UPDATE_SUBSUBCATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_SUBSUBCATEGORY_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_SUBSUBCATEGORY_RESET:
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

// Subsubcategory details
export const subsubcategoryDetailsReducer = (
  state = { subsubcategory: {} },
  action
) => {
  switch (action.type) {
    case SUBSUBCATEGORY_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case SUBSUBCATEGORY_DETAILS_SUCCESS:
      return {
        loading: false,
        subsubcategory: action.payload,
      };
    case SUBSUBCATEGORY_DETAILS_FAIL:
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

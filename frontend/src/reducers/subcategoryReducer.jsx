// reducers/subcategoryReducer.js
import {
  ADMIN_SUBCATEGORY_FAIL,
  ADMIN_SUBCATEGORY_REQUEST,
  ADMIN_SUBCATEGORY_SUCCESS,
  ALL_SUBCATEGORY_FAIL,
  ALL_SUBCATEGORY_REQUEST,
  ALL_SUBCATEGORY_SUCCESS,
  CLEAR_ERRORS,
  DELETE_SUBCATEGORY_FAIL,
  DELETE_SUBCATEGORY_REQUEST,
  DELETE_SUBCATEGORY_RESET,
  DELETE_SUBCATEGORY_SUCCESS,
  NEW_SUBCATEGORY_FAIL,
  NEW_SUBCATEGORY_REQUEST,
  NEW_SUBCATEGORY_RESET,
  NEW_SUBCATEGORY_SUCCESS,
  SUBCATEGORY_DETAILS_FAIL,
  SUBCATEGORY_DETAILS_REQUEST,
  SUBCATEGORY_DETAILS_SUCCESS,
  UPDATE_SUBCATEGORY_FAIL,
  UPDATE_SUBCATEGORY_REQUEST,
  UPDATE_SUBCATEGORY_RESET,
  UPDATE_SUBCATEGORY_SUCCESS,
} from "../constants/subcategoryContants";

export const subcategoriesReducer = (state = { subcategories: [] }, action) => {
  switch (action.type) {
    case ALL_SUBCATEGORY_REQUEST:
    case ADMIN_SUBCATEGORY_REQUEST:
      return {
        loading: true,
        subcategories: [],
      };
    case ALL_SUBCATEGORY_SUCCESS:
      return {
        loading: false,
        subcategories: action.payload,
      };
    case ADMIN_SUBCATEGORY_SUCCESS:
      return {
        loading: false,
        subcategories: action.payload,
      };
    case ALL_SUBCATEGORY_FAIL:
    case ADMIN_SUBCATEGORY_FAIL:
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

export const newSubcategoryReducer = (state = { subcategory: {} }, action) => {
  switch (action.type) {
    case NEW_SUBCATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_SUBCATEGORY_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        subcategory: action.payload.subcategory,
      };
    case NEW_SUBCATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_SUBCATEGORY_RESET:
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

export const subcategoryReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_SUBCATEGORY_REQUEST:
    case UPDATE_SUBCATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_SUBCATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_SUBCATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_SUBCATEGORY_FAIL:
    case UPDATE_SUBCATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_SUBCATEGORY_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_SUBCATEGORY_RESET:
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

export const subcategoryDetailsReducer = (
  state = { subcategory: {} },
  action
) => {
  switch (action.type) {
    case SUBCATEGORY_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case SUBCATEGORY_DETAILS_SUCCESS:
      return {
        loading: false,
        subcategory: action.payload,
      };
    case SUBCATEGORY_DETAILS_FAIL:
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

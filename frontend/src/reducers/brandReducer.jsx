import {
  ADMIN_BRAND_FAIL,
  ADMIN_BRAND_REQUEST,
  ADMIN_BRAND_SUCCESS,
  ALL_BRAND_FAIL,
  ALL_BRAND_REQUEST,
  ALL_BRAND_SUCCESS,
  BRAND_DETAILS_FAIL,
  BRAND_DETAILS_REQUEST,
  BRAND_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  DELETE_BRAND_FAIL,
  DELETE_BRAND_REQUEST,
  DELETE_BRAND_RESET,
  DELETE_BRAND_SUCCESS,
  NEW_BRAND_FAIL,
  NEW_BRAND_REQUEST,
  NEW_BRAND_RESET,
  NEW_BRAND_SUCCESS,
  UPDATE_BRAND_FAIL,
  UPDATE_BRAND_REQUEST,
  UPDATE_BRAND_RESET,
  UPDATE_BRAND_SUCCESS,
} from "../constants/brandContants";

// ✅ Get All Brands / Admin Brands
export const brandsReducer = (state = { brands: [] }, action) => {
  switch (action.type) {
    case ALL_BRAND_REQUEST:
    case ADMIN_BRAND_REQUEST:
      return {
        loading: true,
        brands: [],
      };
    case ALL_BRAND_SUCCESS:
      return {
        loading: false,
        brands: action.payload.brands || action.payload, // depends on API
      };
    case ADMIN_BRAND_SUCCESS:
      return {
        loading: false,
        brands: action.payload,
      };
    case ALL_BRAND_FAIL:
    case ADMIN_BRAND_FAIL:
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

// ✅ Create Brand
export const newBrandReducer = (state = { brand: {} }, action) => {
  switch (action.type) {
    case NEW_BRAND_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_BRAND_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        brand: action.payload.brand,
      };
    case NEW_BRAND_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_BRAND_RESET:
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

// ✅ Delete / Update Brand
export const brandReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_BRAND_REQUEST:
    case UPDATE_BRAND_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_BRAND_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_BRAND_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_BRAND_FAIL:
    case UPDATE_BRAND_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_BRAND_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_BRAND_RESET:
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

// ✅ Brand Details
export const brandDetailsReducer = (state = { brand: {} }, action) => {
  switch (action.type) {
    case BRAND_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case BRAND_DETAILS_SUCCESS:
      return {
        loading: false,
        brand: action.payload,
      };
    case BRAND_DETAILS_FAIL:
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

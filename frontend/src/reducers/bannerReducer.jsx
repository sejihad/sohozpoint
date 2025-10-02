import {
  ADMIN_BANNER_FAIL,
  ADMIN_BANNER_REQUEST,
  ADMIN_BANNER_SUCCESS,
  ALL_BANNER_FAIL,
  ALL_BANNER_REQUEST,
  ALL_BANNER_SUCCESS,
  BANNER_DETAILS_FAIL,
  BANNER_DETAILS_REQUEST,
  BANNER_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  DELETE_BANNER_FAIL,
  DELETE_BANNER_REQUEST,
  DELETE_BANNER_RESET,
  DELETE_BANNER_SUCCESS,
  NEW_BANNER_FAIL,
  NEW_BANNER_REQUEST,
  NEW_BANNER_RESET,
  NEW_BANNER_SUCCESS,
  UPDATE_BANNER_FAIL,
  UPDATE_BANNER_REQUEST,
  UPDATE_BANNER_RESET,
  UPDATE_BANNER_SUCCESS,
} from "../constants/bannerContants";

// ✅ Get all banners (Public & Admin)
export const bannersReducer = (state = { banners: [] }, action) => {
  switch (action.type) {
    case ALL_BANNER_REQUEST:
    case ADMIN_BANNER_REQUEST:
      return {
        loading: true,
        banners: [],
      };
    case ALL_BANNER_SUCCESS:
      return {
        loading: false,
        banners: action.payload.banners,
      };
    case ADMIN_BANNER_SUCCESS:
      return {
        loading: false,
        banners: action.payload,
      };
    case ALL_BANNER_FAIL:
    case ADMIN_BANNER_FAIL:
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

// ✅ Create new banner (Admin)
export const newBannerReducer = (state = { banner: {} }, action) => {
  switch (action.type) {
    case NEW_BANNER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_BANNER_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        banner: action.payload.banner,
      };
    case NEW_BANNER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_BANNER_RESET:
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

// ✅ Update / Delete Banner
export const bannerReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_BANNER_REQUEST:
    case UPDATE_BANNER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_BANNER_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_BANNER_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_BANNER_FAIL:
    case UPDATE_BANNER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_BANNER_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_BANNER_RESET:
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

// ✅ Banner Details
export const bannerDetailsReducer = (state = { banner: {} }, action) => {
  switch (action.type) {
    case BANNER_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case BANNER_DETAILS_SUCCESS:
      return {
        loading: false,
        banner: action.payload,
      };
    case BANNER_DETAILS_FAIL:
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

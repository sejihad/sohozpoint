import {
  ADMIN_GENDER_FAIL,
  ADMIN_GENDER_REQUEST,
  ADMIN_GENDER_SUCCESS,
  ALL_GENDER_FAIL,
  ALL_GENDER_REQUEST,
  ALL_GENDER_SUCCESS,
  CLEAR_ERRORS,
  DELETE_GENDER_FAIL,
  DELETE_GENDER_REQUEST,
  DELETE_GENDER_RESET,
  DELETE_GENDER_SUCCESS,
  GENDER_DETAILS_FAIL,
  GENDER_DETAILS_REQUEST,
  GENDER_DETAILS_SUCCESS,
  NEW_GENDER_FAIL,
  NEW_GENDER_REQUEST,
  NEW_GENDER_RESET,
  NEW_GENDER_SUCCESS,
  UPDATE_GENDER_FAIL,
  UPDATE_GENDER_REQUEST,
  UPDATE_GENDER_RESET,
  UPDATE_GENDER_SUCCESS,
} from "../constants/genderContants";

// ✅ Get All Genders / Admin Genders
export const gendersReducer = (state = { genders: [] }, action) => {
  switch (action.type) {
    case ALL_GENDER_REQUEST:
    case ADMIN_GENDER_REQUEST:
      return { loading: true, genders: [] };

    case ALL_GENDER_SUCCESS:
    case ADMIN_GENDER_SUCCESS:
      return { loading: false, genders: action.payload };

    case ALL_GENDER_FAIL:
    case ADMIN_GENDER_FAIL:
      return { loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

// ✅ Create Gender
export const newGenderReducer = (state = { gender: {} }, action) => {
  switch (action.type) {
    case NEW_GENDER_REQUEST:
      return { ...state, loading: true };

    case NEW_GENDER_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        gender: action.payload.gender,
      };

    case NEW_GENDER_FAIL:
      return { ...state, loading: false, error: action.payload };

    case NEW_GENDER_RESET:
      return { ...state, success: false };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

// ✅ Delete / Update Gender
export const genderReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_GENDER_REQUEST:
    case UPDATE_GENDER_REQUEST:
      return { ...state, loading: true };

    case DELETE_GENDER_SUCCESS:
      return { ...state, loading: false, isDeleted: action.payload };

    case UPDATE_GENDER_SUCCESS:
      return { ...state, loading: false, isUpdated: action.payload };

    case DELETE_GENDER_FAIL:
    case UPDATE_GENDER_FAIL:
      return { ...state, loading: false, error: action.payload };

    case DELETE_GENDER_RESET:
      return { ...state, isDeleted: false };

    case UPDATE_GENDER_RESET:
      return { ...state, isUpdated: false };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

// ✅ Gender Details
export const genderDetailsReducer = (state = { gender: {} }, action) => {
  switch (action.type) {
    case GENDER_DETAILS_REQUEST:
      return { loading: true, ...state };

    case GENDER_DETAILS_SUCCESS:
      return { loading: false, gender: action.payload };

    case GENDER_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};

import axios from "axios";
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
  DELETE_GENDER_SUCCESS,
  GENDER_DETAILS_FAIL,
  GENDER_DETAILS_REQUEST,
  GENDER_DETAILS_SUCCESS,
  NEW_GENDER_FAIL,
  NEW_GENDER_REQUEST,
  NEW_GENDER_SUCCESS,
  UPDATE_GENDER_FAIL,
  UPDATE_GENDER_REQUEST,
  UPDATE_GENDER_SUCCESS,
} from "../constants/genderContants";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Get All Genders (Public)
export const getGenders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_GENDER_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/genders`);

    dispatch({
      type: ALL_GENDER_SUCCESS,
      payload: data.genders,
    });
  } catch (error) {
    dispatch({
      type: ALL_GENDER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Admin Genders
export const getAdminGenders = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_GENDER_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.get(`${API_URL}/api/v1/admin/genders`, config);

    dispatch({
      type: ADMIN_GENDER_SUCCESS,
      payload: data.genders,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_GENDER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Gender Details
export const getGenderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: GENDER_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/gender/${id}`);

    dispatch({
      type: GENDER_DETAILS_SUCCESS,
      payload: data.gender,
    });
  } catch (error) {
    dispatch({
      type: GENDER_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Create Gender
export const createGender = (genderData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_GENDER_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/gender/new`,
      genderData,
      config
    );

    dispatch({
      type: NEW_GENDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_GENDER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Update Gender
export const updateGender = (id, genderData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_GENDER_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/gender/${id}`,
      genderData,
      config
    );

    dispatch({
      type: UPDATE_GENDER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_GENDER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Delete Gender
export const deleteGender = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_GENDER_REQUEST });

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/gender/${id}`,
      config
    );

    dispatch({
      type: DELETE_GENDER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_GENDER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

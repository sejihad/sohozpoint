import axios from "axios";
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
  DELETE_LOGO_SUCCESS,
  LOGO_DETAILS_FAIL,
  LOGO_DETAILS_REQUEST,
  LOGO_DETAILS_SUCCESS,
  NEW_LOGO_FAIL,
  NEW_LOGO_REQUEST,
  NEW_LOGO_SUCCESS,
  UPDATE_LOGO_FAIL,
  UPDATE_LOGO_REQUEST,
  UPDATE_LOGO_SUCCESS,
} from "../constants/logoContants";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Get All Logos (Public)
export const getLogos = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_LOGO_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/logos`);

    dispatch({
      type: ALL_LOGO_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_LOGO_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get All Logos (Admin)
export const getAdminLogos = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_LOGO_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/v1/admin/logos`, config);

    dispatch({
      type: ADMIN_LOGO_SUCCESS,
      payload: data.logos,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_LOGO_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Single Logo Details
export const getLogoDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: LOGO_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/logo/${id}`);

    dispatch({
      type: LOGO_DETAILS_SUCCESS,
      payload: data.logo,
    });
  } catch (error) {
    dispatch({
      type: LOGO_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Create Logo (Admin)
export const createLogo = (logoData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_LOGO_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/logo/new`,
      logoData,
      config
    );

    dispatch({
      type: NEW_LOGO_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_LOGO_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Delete Logo (Admin)
export const deleteLogo = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_LOGO_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/logo/${id}`,
      config
    );

    dispatch({
      type: DELETE_LOGO_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_LOGO_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Update Logo (Admin)
export const updateLogo = (id, logoData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_LOGO_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/logo/${id}`,
      logoData,
      config
    );

    dispatch({
      type: UPDATE_LOGO_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_LOGO_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

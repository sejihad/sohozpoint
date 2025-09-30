import axios from "axios";
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
  DELETE_TYPE_SUCCESS,
  NEW_TYPE_FAIL,
  NEW_TYPE_REQUEST,
  NEW_TYPE_SUCCESS,
  TYPE_DETAILS_FAIL,
  TYPE_DETAILS_REQUEST,
  TYPE_DETAILS_SUCCESS,
  UPDATE_TYPE_FAIL,
  UPDATE_TYPE_REQUEST,
  UPDATE_TYPE_SUCCESS,
} from "../constants/typeContants";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Get All Types (Public)
export const getTypes = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_TYPE_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/types`);

    dispatch({
      type: ALL_TYPE_SUCCESS,
      payload: data.types,
    });
  } catch (error) {
    dispatch({
      type: ALL_TYPE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Admin Types
export const getAdminTypes = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_TYPE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.get(`${API_URL}/api/v1/admin/types`, config);

    dispatch({
      type: ADMIN_TYPE_SUCCESS,
      payload: data.types,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_TYPE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Type Details
export const getTypeDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: TYPE_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/type/${id}`);

    dispatch({
      type: TYPE_DETAILS_SUCCESS,
      payload: data.type,
    });
  } catch (error) {
    dispatch({
      type: TYPE_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Create Type
export const createType = (typeData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_TYPE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/type/new`,
      typeData,
      config
    );

    dispatch({
      type: NEW_TYPE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_TYPE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Update Type
export const updateType = (id, typeData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TYPE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/type/${id}`,
      typeData,
      config
    );

    dispatch({
      type: UPDATE_TYPE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TYPE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Delete Type
export const deleteType = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TYPE_REQUEST });

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/type/${id}`,
      config
    );

    dispatch({
      type: DELETE_TYPE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_TYPE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

// actions/subcategoryAction.js
import axios from "axios";
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
  DELETE_SUBCATEGORY_SUCCESS,
  NEW_SUBCATEGORY_FAIL,
  NEW_SUBCATEGORY_REQUEST,
  NEW_SUBCATEGORY_SUCCESS,
  SUBCATEGORY_DETAILS_FAIL,
  SUBCATEGORY_DETAILS_REQUEST,
  SUBCATEGORY_DETAILS_SUCCESS,
  UPDATE_SUBCATEGORY_FAIL,
  UPDATE_SUBCATEGORY_REQUEST,
  UPDATE_SUBCATEGORY_SUCCESS,
} from "../constants/subcategoryContants";

const API_URL = import.meta.env.VITE_API_URL;

// Get all subcategories (public)
export const getSubcategories = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_SUBCATEGORY_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/subcategories`);

    dispatch({
      type: ALL_SUBCATEGORY_SUCCESS,
      payload: data.subcategories,
    });
  } catch (error) {
    dispatch({
      type: ALL_SUBCATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Get all subcategories for admin
export const getAdminSubcategories = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_SUBCATEGORY_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/v1/subcategories`, config);

    dispatch({
      type: ADMIN_SUBCATEGORY_SUCCESS,
      payload: data.subcategories,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_SUBCATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Get subcategory details
export const getSubcategoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SUBCATEGORY_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/subcategory/${id}`);

    dispatch({
      type: SUBCATEGORY_DETAILS_SUCCESS,
      payload: data.subcategory,
    });
  } catch (error) {
    dispatch({
      type: SUBCATEGORY_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Create subcategory
export const createSubcategory = (subcategoryData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_SUBCATEGORY_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/subcategory/new`,
      subcategoryData,
      config
    );

    dispatch({
      type: NEW_SUBCATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: NEW_SUBCATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Update subcategory
export const updateSubcategory = (id, subcategoryData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SUBCATEGORY_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/subcategory/${id}`,
      subcategoryData,
      config
    );

    dispatch({
      type: UPDATE_SUBCATEGORY_SUCCESS,
      payload: data.subcategory,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SUBCATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Delete subcategory
export const deleteSubcategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SUBCATEGORY_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/subcategory/${id}`,
      config
    );

    dispatch({
      type: DELETE_SUBCATEGORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_SUBCATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

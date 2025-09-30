// actions/subsubcategoryAction.js
import axios from "axios";
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
  DELETE_SUBSUBCATEGORY_SUCCESS,
  NEW_SUBSUBCATEGORY_FAIL,
  NEW_SUBSUBCATEGORY_REQUEST,
  NEW_SUBSUBCATEGORY_SUCCESS,
  SUBSUBCATEGORY_DETAILS_FAIL,
  SUBSUBCATEGORY_DETAILS_REQUEST,
  SUBSUBCATEGORY_DETAILS_SUCCESS,
  UPDATE_SUBSUBCATEGORY_FAIL,
  UPDATE_SUBSUBCATEGORY_REQUEST,
  UPDATE_SUBSUBCATEGORY_SUCCESS,
} from "../constants/subsubcategoryContants";

const API_URL = import.meta.env.VITE_API_URL;

// Get all subsubcategories (public)
export const getSubsubcategories = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_SUBSUBCATEGORY_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/subsubcategories`);

    dispatch({
      type: ALL_SUBSUBCATEGORY_SUCCESS,
      payload: data.subsubcategories,
    });
  } catch (error) {
    dispatch({
      type: ALL_SUBSUBCATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Get all subsubcategories for admin
export const getAdminSubsubcategories = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_SUBSUBCATEGORY_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/v1/subsubcategories`,
      config
    );

    dispatch({
      type: ADMIN_SUBSUBCATEGORY_SUCCESS,
      payload: data.subsubcategories,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: ADMIN_SUBSUBCATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Get subsubcategory details
export const getSubsubcategoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SUBSUBCATEGORY_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/subsubcategory/${id}`);

    dispatch({
      type: SUBSUBCATEGORY_DETAILS_SUCCESS,
      payload: data.subsubcategory,
    });
  } catch (error) {
    dispatch({
      type: SUBSUBCATEGORY_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Create subsubcategory
export const createSubsubcategory =
  (subsubcategoryData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_SUBSUBCATEGORY_REQUEST });

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/v1/admin/subsubcategory/new`,
        subsubcategoryData,
        config
      );

      dispatch({
        type: NEW_SUBSUBCATEGORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_SUBSUBCATEGORY_FAIL,
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };

// Update subsubcategory
export const updateSubsubcategory =
  (id, subsubcategoryData) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_SUBSUBCATEGORY_REQUEST });

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/v1/admin/subsubcategory/${id}`,
        subsubcategoryData,
        config
      );

      dispatch({
        type: UPDATE_SUBSUBCATEGORY_SUCCESS,
        payload: data.subsubcategory,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_SUBSUBCATEGORY_FAIL,
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };

// Delete subsubcategory
export const deleteSubsubcategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SUBSUBCATEGORY_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/subsubcategory/${id}`,
      config
    );

    dispatch({
      type: DELETE_SUBSUBCATEGORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_SUBSUBCATEGORY_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

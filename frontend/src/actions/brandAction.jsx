import axios from "axios";
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
  DELETE_BRAND_SUCCESS,
  NEW_BRAND_FAIL,
  NEW_BRAND_REQUEST,
  NEW_BRAND_SUCCESS,
  UPDATE_BRAND_FAIL,
  UPDATE_BRAND_REQUEST,
  UPDATE_BRAND_SUCCESS,
} from "../constants/brandContants";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Get All Brands (Public)
export const getBrands = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_BRAND_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/brands`);

    dispatch({
      type: ALL_BRAND_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_BRAND_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Admin Brands
export const getAdminBrands = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_BRAND_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/v1/admin/brands`, config);

    dispatch({
      type: ADMIN_BRAND_SUCCESS,
      payload: data.brands,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_BRAND_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Brand Details
export const getBrandDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BRAND_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/brand/${id}`);

    dispatch({
      type: BRAND_DETAILS_SUCCESS,
      payload: data.brand,
    });
  } catch (error) {
    dispatch({
      type: BRAND_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Create Brand
export const createBrand = (brandData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_BRAND_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/brand/new`,
      brandData,
      config
    );

    dispatch({
      type: NEW_BRAND_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_BRAND_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Update Brand
export const updateBrand = (id, brandData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BRAND_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/brand/${id}`,
      brandData,
      config
    );

    dispatch({
      type: UPDATE_BRAND_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_BRAND_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Delete Brand
export const deleteBrand = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BRAND_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/brand/${id}`,
      config
    );

    dispatch({
      type: DELETE_BRAND_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_BRAND_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

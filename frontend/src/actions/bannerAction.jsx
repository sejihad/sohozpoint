import axios from "axios";
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
  DELETE_BANNER_SUCCESS,
  NEW_BANNER_FAIL,
  NEW_BANNER_REQUEST,
  NEW_BANNER_SUCCESS,
  UPDATE_BANNER_FAIL,
  UPDATE_BANNER_REQUEST,
  UPDATE_BANNER_SUCCESS,
} from "../constants/bannerContants";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Get All Banners (Public)
export const getBanners = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_BANNER_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/banners`);

    dispatch({
      type: ALL_BANNER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_BANNER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get All Banners (Admin)
export const getAdminBanners = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_BANNER_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/v1/admin/banners`, config);

    dispatch({
      type: ADMIN_BANNER_SUCCESS,
      payload: data.banners,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_BANNER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Single Banner Details
export const getBannerDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BANNER_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/banner/${id}`);

    dispatch({
      type: BANNER_DETAILS_SUCCESS,
      payload: data.banner,
    });
  } catch (error) {
    dispatch({
      type: BANNER_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Create Banner (Admin)
export const createBanner = (bannerData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_BANNER_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/banner/new`,
      bannerData,
      config
    );

    dispatch({
      type: NEW_BANNER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_BANNER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Delete Banner (Admin)
export const deleteBanner = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BANNER_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/banner/${id}`,
      config
    );

    dispatch({
      type: DELETE_BANNER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_BANNER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Update Banner (Admin)
export const updateBanner = (id, bannerData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BANNER_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/banner/${id}`,
      bannerData,
      config
    );

    dispatch({
      type: UPDATE_BANNER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_BANNER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

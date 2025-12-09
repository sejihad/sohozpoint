import axios from "axios";
import {
  ALL_COUPON_FAIL,
  ALL_COUPON_REQUEST,
  ALL_COUPON_SUCCESS,
  APPLY_COUPON_FAIL,
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  CLEAR_COUPON_FAIL,
  CLEAR_COUPON_REQUEST,
  CLEAR_COUPON_SUCCESS,
  CLEAR_ERRORS,
  COUPON_DETAILS_FAIL,
  COUPON_DETAILS_REQUEST,
  COUPON_DETAILS_SUCCESS,
  DELETE_COUPON_FAIL,
  DELETE_COUPON_REQUEST,
  DELETE_COUPON_SUCCESS,
  NEW_COUPON_FAIL,
  NEW_COUPON_REQUEST,
  NEW_COUPON_SUCCESS,
  UPDATE_COUPON_FAIL,
  UPDATE_COUPON_REQUEST,
  UPDATE_COUPON_SUCCESS,
} from "../constants/couponContants";

const API_URL = import.meta.env.VITE_API_URL;

// -------------------- Admin Actions --------------------

// ✅ Get All Coupons (Admin)
export const getAdminCoupons = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_COUPON_REQUEST });

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.get(`${API_URL}/api/v1/admin/coupons`, config);

    dispatch({
      type: ALL_COUPON_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_COUPON_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Single Coupon Details (Admin)
export const getCouponDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: COUPON_DETAILS_REQUEST });

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.get(
      `${API_URL}/api/v1/admin/coupon/${id}`,
      config
    );

    dispatch({
      type: COUPON_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUPON_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Create Coupon (Admin)
export const createCoupon = (couponData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_COUPON_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/coupon/new`,
      couponData,
      config
    );

    dispatch({
      type: NEW_COUPON_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_COUPON_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Update Coupon (Admin)
export const updateCoupon = (id, couponData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_COUPON_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/coupon/${id}`,
      couponData,
      config
    );

    dispatch({
      type: UPDATE_COUPON_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_COUPON_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Delete Coupon (Admin)
export const deleteCoupon = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_COUPON_REQUEST });

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/coupon/${id}`,
      config
    );

    dispatch({
      type: DELETE_COUPON_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DELETE_COUPON_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// -------------------- User Action --------------------

// ✅ Apply Coupon (User)
export const applyCoupon =
  (code, amount, productIds = []) =>
  async (dispatch) => {
    try {
      dispatch({ type: APPLY_COUPON_REQUEST });

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/v1/coupon/apply`,
        { code, amount, productIds },
        config
      );

      dispatch({
        type: APPLY_COUPON_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: APPLY_COUPON_FAIL,
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };
// ✅ Clear Coupon (User)
export const clearCoupon = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_COUPON_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Call backend to clear applied coupon
    const { data } = await axios.post(
      `${API_URL}/api/v1/coupon/clear`,
      {},
      config
    );

    dispatch({
      type: CLEAR_COUPON_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLEAR_COUPON_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
// ✅ Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

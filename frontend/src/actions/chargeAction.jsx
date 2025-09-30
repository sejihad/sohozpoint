import axios from "axios";
import {
  ADMIN_CHARGE_FAIL,
  ADMIN_CHARGE_REQUEST,
  ADMIN_CHARGE_SUCCESS,
  ALL_CHARGE_FAIL,
  ALL_CHARGE_REQUEST,
  ALL_CHARGE_SUCCESS,
  CHARGE_DETAILS_FAIL,
  CHARGE_DETAILS_REQUEST,
  CHARGE_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  DELETE_CHARGE_FAIL,
  DELETE_CHARGE_REQUEST,
  DELETE_CHARGE_SUCCESS,
  NEW_CHARGE_FAIL,
  NEW_CHARGE_REQUEST,
  NEW_CHARGE_SUCCESS,
  UPDATE_CHARGE_FAIL,
  UPDATE_CHARGE_REQUEST,
  UPDATE_CHARGE_SUCCESS,
} from "../constants/chargeContants";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Get Charge (Public)
export const getCharge = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_CHARGE_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/charges`);

    dispatch({
      type: ALL_CHARGE_SUCCESS,
      payload: data.charge,
    });
  } catch (error) {
    dispatch({
      type: ALL_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Charge (Admin)
export const getAdminCharge = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_CHARGE_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.get(`${API_URL}/api/v1/admin/charges`, config);

    dispatch({
      type: ADMIN_CHARGE_SUCCESS,
      payload: data.charge,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Single Charge Details
export const getChargeDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CHARGE_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/charge/${id}`);

    dispatch({
      type: CHARGE_DETAILS_SUCCESS,
      payload: data.charge,
    });
  } catch (error) {
    dispatch({
      type: CHARGE_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Create Charge (Admin, only if not exists)
export const createCharge = (chargeData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_CHARGE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/charge/new`,
      chargeData,
      config
    );

    dispatch({
      type: NEW_CHARGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Update Charge (Admin)
export const updateCharge = (id, chargeData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CHARGE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/charge/${id}`,
      chargeData,
      config
    );

    dispatch({
      type: UPDATE_CHARGE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Delete Charge (Admin)
export const deleteCharge = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CHARGE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/charge/${id}`,
      config
    );

    dispatch({
      type: DELETE_CHARGE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

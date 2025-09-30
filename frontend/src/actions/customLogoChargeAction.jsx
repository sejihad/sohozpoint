import axios from "axios";
import {
  ADMIN_LOGO_CHARGE_FAIL,
  ADMIN_LOGO_CHARGE_REQUEST,
  ADMIN_LOGO_CHARGE_SUCCESS,
  ALL_LOGO_CHARGE_FAIL,
  ALL_LOGO_CHARGE_REQUEST,
  ALL_LOGO_CHARGE_SUCCESS,
  CLEAR_ERRORS,
  DELETE_LOGO_CHARGE_FAIL,
  DELETE_LOGO_CHARGE_REQUEST,
  DELETE_LOGO_CHARGE_SUCCESS,
  LOGO_CHARGE_DETAILS_FAIL,
  LOGO_CHARGE_DETAILS_REQUEST,
  LOGO_CHARGE_DETAILS_SUCCESS,
  NEW_LOGO_CHARGE_FAIL,
  NEW_LOGO_CHARGE_REQUEST,
  NEW_LOGO_CHARGE_SUCCESS,
  UPDATE_LOGO_CHARGE_FAIL,
  UPDATE_LOGO_CHARGE_REQUEST,
  UPDATE_LOGO_CHARGE_SUCCESS,
} from "../constants/customLogoChargeContants";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Get Charge (Public)
export const getCustomLogoCharge = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_LOGO_CHARGE_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/logocharges`);

    dispatch({
      type: ALL_LOGO_CHARGE_SUCCESS,
      payload: data.charge,
    });
  } catch (error) {
    dispatch({
      type: ALL_LOGO_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Charge (Admin)
export const getAdminCustomLogoCharge = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_LOGO_CHARGE_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.get(
      `${API_URL}/api/v1/admin/logocharges`,
      config
    );

    dispatch({
      type: ADMIN_LOGO_CHARGE_SUCCESS,
      payload: data.charge,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_LOGO_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Get Single Charge Details
export const getCustomLogoChargeDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: LOGO_CHARGE_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/logocharge/${id}`);

    dispatch({
      type: LOGO_CHARGE_DETAILS_SUCCESS,
      payload: data.charge,
    });
  } catch (error) {
    dispatch({
      type: LOGO_CHARGE_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Create Charge (Admin)
export const createCustomLogoCharge = (chargeData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_LOGO_CHARGE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/logocharge/new`,
      chargeData,
      config
    );

    dispatch({
      type: NEW_LOGO_CHARGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_LOGO_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Update Charge (Admin)
export const updateCustomLogoCharge = (id, chargeData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_LOGO_CHARGE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/logocharge/${id}`,
      chargeData,
      config
    );

    dispatch({
      type: UPDATE_LOGO_CHARGE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_LOGO_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Delete Charge (Admin)
export const deleteCustomLogoCharge = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_LOGO_CHARGE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/logocharge/${id}`,
      config
    );

    dispatch({
      type: DELETE_LOGO_CHARGE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_LOGO_CHARGE_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// ✅ Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

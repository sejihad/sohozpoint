import axios from "axios";
import {
  ADVANCED_PAYMENT_FAIL,
  ADVANCED_PAYMENT_REQUEST,
  ADVANCED_PAYMENT_SUCCESS,
  CLEAR_ERRORS,
  DELETE_ADVANCED_PAYMENT_FAIL,
  DELETE_ADVANCED_PAYMENT_REQUEST,
  DELETE_ADVANCED_PAYMENT_SUCCESS,
  UPDATE_ADVANCED_PAYMENT_FAIL,
  UPDATE_ADVANCED_PAYMENT_REQUEST,
  UPDATE_ADVANCED_PAYMENT_SUCCESS,
} from "../constants/AdvancedPaymentContants";

const API_URL = import.meta.env.VITE_API_URL;

// Get current advanced payment (singleton)
export const getAdvancedPayment = () => async (dispatch) => {
  try {
    dispatch({ type: ADVANCED_PAYMENT_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/advanced-payment`);

    dispatch({
      type: ADVANCED_PAYMENT_SUCCESS,
      payload: data.advancedPayment, // controller এ যেভাবে পাঠিয়েছি
    });
  } catch (error) {
    dispatch({
      type: ADVANCED_PAYMENT_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Set / Update (Upsert) advanced payment
export const updateAdvancedPayment = (payload) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ADVANCED_PAYMENT_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/advanced-payment`,
      payload,
      config,
    );

    dispatch({
      type: UPDATE_ADVANCED_PAYMENT_SUCCESS,
      payload: data.advancedPayment, // updated doc
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ADVANCED_PAYMENT_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Optional: Delete/Reset advanced payment config
export const deleteAdvancedPayment = () => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ADVANCED_PAYMENT_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/advanced-payment`,
      config,
    );

    dispatch({
      type: DELETE_ADVANCED_PAYMENT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_ADVANCED_PAYMENT_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

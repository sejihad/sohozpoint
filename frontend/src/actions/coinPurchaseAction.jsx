import axios from "axios";
import {
  COIN_PURCHASE_CANCEL_FAIL,
  COIN_PURCHASE_CANCEL_REQUEST,
  COIN_PURCHASE_CANCEL_SUCCESS,
  COIN_PURCHASE_CLEAR_ERRORS,
  COIN_PURCHASE_FAIL_FAIL,
  COIN_PURCHASE_FAIL_REQUEST,
  COIN_PURCHASE_FAIL_SUCCESS,
  COIN_PURCHASE_INIT_FAIL,
  COIN_PURCHASE_INIT_REQUEST,
  COIN_PURCHASE_INIT_SUCCESS,
  COIN_PURCHASE_VERIFY_FAIL,
  COIN_PURCHASE_VERIFY_REQUEST,
  COIN_PURCHASE_VERIFY_SUCCESS,
} from "../constants/coinPurchaseContants";

const API_URL = import.meta.env.VITE_API_URL;
export const initializeCoinPurchase = (coins) => async (dispatch) => {
  try {
    dispatch({ type: COIN_PURCHASE_INIT_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/coin/purchase/initialize`,
      { coins },
      config,
    );

    dispatch({ type: COIN_PURCHASE_INIT_SUCCESS, payload: data });

    if (data?.redirectUrl) {
      window.location.href = data.redirectUrl; // ✅ EPS redirect
    }
  } catch (error) {
    console.log("Coin purchase initialization error:", error);
    dispatch({
      type: COIN_PURCHASE_INIT_FAIL,
      payload:
        error.response?.data?.message || "Coin purchase initialization failed",
    });
  }
};
export const verifyCoinPurchase =
  (merchantTransactionId) => async (dispatch) => {
    try {
      dispatch({ type: COIN_PURCHASE_VERIFY_REQUEST });

      const { data } = await axios.post(
        `${API_URL}/api/v1/coin/purchase/success`,
        {
          merchantTransactionId,
        },
      );

      dispatch({ type: COIN_PURCHASE_VERIFY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: COIN_PURCHASE_VERIFY_FAIL,
        payload:
          error.response?.data?.message || "Coin purchase verification failed",
      });
    }
  };

export const markCoinPurchaseFail =
  (merchantTransactionId) => async (dispatch) => {
    try {
      dispatch({ type: COIN_PURCHASE_FAIL_REQUEST });

      const { data } = await axios.post(
        `${API_URL}/api/v1/coin/purchase/fail`,
        {
          merchantTransactionId,
        },
      );

      dispatch({ type: COIN_PURCHASE_FAIL_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: COIN_PURCHASE_FAIL_FAIL,
        payload:
          error.response?.data?.message || "Failed to mark purchase as failed",
      });
    }
  };

export const markCoinPurchaseCancel =
  (merchantTransactionId) => async (dispatch) => {
    try {
      dispatch({ type: COIN_PURCHASE_CANCEL_REQUEST });

      const { data } = await axios.post(
        `${API_URL}/api/v1/coin/purchase/cancel`,
        {
          merchantTransactionId,
        },
      );

      dispatch({ type: COIN_PURCHASE_CANCEL_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: COIN_PURCHASE_CANCEL_FAIL,
        payload:
          error.response?.data?.message ||
          "Failed to mark purchase as cancelled",
      });
    }
  };

export const clearCoinPurchaseErrors = () => (dispatch) => {
  dispatch({ type: COIN_PURCHASE_CLEAR_ERRORS });
};

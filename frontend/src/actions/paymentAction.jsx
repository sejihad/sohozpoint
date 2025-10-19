import axios from "axios";
import {
  CLEAR_ERRORS,
  PAYMENT_INITIALIZE_FAIL,
  PAYMENT_INITIALIZE_REQUEST,
  PAYMENT_INITIALIZE_SUCCESS,
} from "../constants/paymentContants";

const API_URL = import.meta.env.VITE_API_URL;

export const initializePayment = (orderData) => async (dispatch) => {
  console.log(orderData);
  try {
    dispatch({ type: PAYMENT_INITIALIZE_REQUEST });

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // ১️⃣ EPS Initialize API কল
    const { data } = await axios.post(
      `${API_URL}/api/v1/payment/initialize`,
      orderData,
      config
    );

    if (data?.redirectUrl) {
      dispatch({
        type: PAYMENT_INITIALIZE_SUCCESS,
        payload: data.redirectUrl,
      });
      console.log(data?.redirectUrl);
      window.location.href = data.redirectUrl;
    } else {
      throw new Error("Failed to get payment link");
    }
  } catch (error) {
    dispatch({
      type: PAYMENT_INITIALIZE_FAIL,
      payload: error.response?.data?.message || "Payment initialization failed",
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

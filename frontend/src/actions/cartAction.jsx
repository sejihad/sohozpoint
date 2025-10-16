import axios from "axios";
import { toast } from "react-toastify";
import {
  ADD_TO_CART_FAIL,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  GET_CART_FAIL,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  REMOVE_CART_ITEM,
} from "../constants/cartContants";

const API_URL = import.meta.env.VITE_API_URL;

// ➕ Add or replace item in cart
export const addItemsToCart =
  (productId, quantity, size, color) => async (dispatch) => {
    try {
      dispatch({ type: ADD_TO_CART_REQUEST });

      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await axios.post(
        `${API_URL}/api/v1/cart/add`,
        { productId, quantity, size, color },
        config
      );

      dispatch({
        type: ADD_TO_CART_SUCCESS,
        payload: data.cart,
      });
    } catch (error) {
      dispatch({
        type: ADD_TO_CART_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

// 🗑️ Remove item from cart
export const removeItemsFromCart =
  (productId, size, color) => async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/cart/remove`, {
        data: { productId, size, color },
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: REMOVE_CART_ITEM,
        payload: { productId, size, color },
      });

      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

// 🧾 Get user cart
export const getCart = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CART_REQUEST });

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.get(`${API_URL}/api/v1/cart`, config);
    console.log(data);
    dispatch({
      type: GET_CART_SUCCESS,
      payload: data.cart,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_CART_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error("Failed to load cart");
  }
};

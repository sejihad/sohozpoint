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

// Add or Update Cart Item
export const addItemsToCart =
  (productId, quantity, size, color) => async (dispatch, getState) => {
    try {
      dispatch({ type: ADD_TO_CART_REQUEST });

      const { data } = await axios.post(
        "/api/v1/cart/add",
        {
          productId,
          quantity,
          size,
          color,
        },
        { withCredentials: true }
      );

      dispatch({
        type: ADD_TO_CART_SUCCESS,
        payload: data.cart,
      });

      localStorage.setItem("cartItems", JSON.stringify(data.cart.items));
    } catch (error) {
      dispatch({
        type: ADD_TO_CART_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

// Get Logged-in User Cart
export const getCart = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CART_REQUEST });

    const { data } = await axios.get("/api/v1/cart", { withCredentials: true });

    dispatch({
      type: GET_CART_SUCCESS,
      payload: data.cart,
    });

    localStorage.setItem("cartItems", JSON.stringify(data.cart.items));
  } catch (error) {
    dispatch({
      type: GET_CART_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    toast.error("Failed to load cart");
  }
};

// Remove item from cart
export const removeItemsFromCart =
  (productId, size, color) => async (dispatch, getState) => {
    try {
      await axios.delete(`/api/v1/cart/remove`, {
        data: { productId, size, color },
        withCredentials: true,
      });

      dispatch({
        type: REMOVE_CART_ITEM,
        payload: { productId, size, color },
      });

      const { cart } = getState();
      localStorage.setItem("cartItems", JSON.stringify(cart.cartItems));
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

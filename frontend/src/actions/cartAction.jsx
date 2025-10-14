import axios from "axios";
import { toast } from "react-toastify";
import { ADD_TO_CART, REMOVE_CART_ITEM } from "../constants/cartContants";

const API_URL = import.meta.env.VITE_API_URL;

// 🛒 Add item to cart (backend-synced)
export const addItemsToCart =
  (id, quantity = 1, selectedSize = null, selectedColor = null) =>
  async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // 1️⃣ Get product details
      const { data } = await axios.get(
        `${API_URL}/api/v1/products/${id}`,
        config
      );
      const item = data.product;

      if (!item) {
        toast.error("Product not found");
        return;
      }

      // 🔒 Check availability
      if (item.availability === "unavailable") {
        toast.error("This product is currently unavailable");
        return;
      }

      // 2️⃣ Add item to backend cart
      const response = await axios.post(
        `${API_URL}/api/v1/cart/add`,
        {
          productId: item._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        },
        config
      );

      // 3️⃣ Get updated cart from backend
      const updatedCart = response.data.cart;

      // 4️⃣ Update Redux store
      dispatch({
        type: ADD_TO_CART,
        payload: updatedCart,
      });

      toast.success("Item added to your cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

// 🗑️ Remove item from cart (backend-synced)
export const removeItemsFromCart =
  (id, selectedSize = null, selectedColor = null) =>
  async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // 1️⃣ Send remove request to backend
      const response = await axios.post(
        `${API_URL}/api/v1/cart/remove`,
        {
          productId: id,
          size: selectedSize,
          color: selectedColor,
        },
        config
      );

      // 2️⃣ Get updated cart
      const updatedCart = response.data.cart;

      // 3️⃣ Update Redux store
      dispatch({
        type: REMOVE_CART_ITEM,
        payload: updatedCart,
      });

      toast.info("Item removed from your cart.");
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    }
  };

export const getCart = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/v1/cart`, config);

    dispatch({
      type: ADD_TO_CART,
      payload: data.cart, // backend থেকে আসা cart
    });
  } catch (error) {
    console.error("Get cart error:", error);
    toast.error(error.response?.data?.message || "Failed to fetch cart");
  }
};

import axios from "axios";
import { toast } from "react-toastify";
import { ADD_TO_CART, REMOVE_CART_ITEM } from "../constants/cartContants";

const API_URL = import.meta.env.VITE_API_URL;

// 🛒 Add item to cart (backend-synced)
export const addItemsToCart =
  (id, quantity = 1, selectedSize = null, selectedColor = null) =>
  async (dispatch, getState) => {
    try {
      // 1️⃣ Get product details
      const { data } = await axios.get(`${API_URL}/api/v1/products/${id}`);
      const item = data.product;

      // 🔒 Check availability
      if (item.availability === "unavailable") {
        toast.error("This product is currently unavailable");
        return;
      }

      // 2️⃣ Send one item to backend to add or increase quantity
      const response = await axios.post(
        `${API_URL}/api/v1/cart`,
        {
          productId: item._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        },
        { withCredentials: true }
      );

      // 3️⃣ Get updated cart from backend
      const updatedCart = response.data.cart.items;

      // 4️⃣ Update Redux
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
      // 1️⃣ Send item info to backend for removal
      const response = await axios.post(
        `${API_URL}/api/v1/cart/remove`,
        {
          productId: id,
          size: selectedSize,
          color: selectedColor,
        },
        { withCredentials: true }
      );

      // 2️⃣ Get updated cart from backend
      const updatedCart = response.data.cart.items;

      // 3️⃣ Update Redux
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

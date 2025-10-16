import {
  ADD_TO_CART_FAIL,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  GET_CART_FAIL,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  REMOVE_CART_ITEM,
} from "../constants/cartContants";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🔄 Loading states
    case ADD_TO_CART_REQUEST:
    case GET_CART_REQUEST:
      return { ...state, loading: true };

    // ✅ Success states (add, get, update quantity)
    case ADD_TO_CART_SUCCESS:
    case GET_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: action.payload.items,
        totalAmount: action.payload.totalAmount,
        error: null,
      };

    // ❌ Fail states
    case ADD_TO_CART_FAIL:
    case GET_CART_FAIL:
      return { ...state, loading: false, error: action.payload };

    // 🗑️ Remove item
    case REMOVE_CART_ITEM:
      const updatedItems = state.cartItems.filter(
        (x) =>
          !(
            x.product === action.payload.productId &&
            x.size === action.payload.size &&
            x.color === action.payload.color
          )
      );
      const newTotal = updatedItems.reduce(
        (sum, i) => sum + (i.subtotal || i.price * i.quantity),
        0
      );
      return {
        ...state,
        cartItems: updatedItems,
        totalAmount: newTotal,
      };

    default:
      return state;
  }
};
